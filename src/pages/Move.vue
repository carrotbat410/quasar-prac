<template>
  <q-page class="flex flex-center">
    <div
      class="game-container"
      :style="gameContainerStyle"
      @click="handleClick"
    >
      <div class="character" :style="characterStyle"></div>
      <div class="scarecrow" :style="scarecrowStyle"></div>
      <div
        v-if="scarecrowHealth > 0"
        class="health-bar"
        :style="healthBarStyle"
      ></div>
      <div v-if="scarecrowHealth <= 0" class="game-over">Game Over</div>
      <div
        v-if="isAiming && canThrowSnowball"
        class="aim-indicator"
        :style="aimStyle"
      ></div>
      <div
        v-for="snowball in snowballs"
        :key="snowball.id"
        class="snowball"
        :style="snowball.style"
      ></div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// 리스폰 지점 변수
const respawnCharacter = ref({ x: 20, y: 220 }); // 캐릭터 리스폰 지점
const respawnScarecrow = ref({ x: 420, y: 220 }); // 허수아비 리스폰 지점

// 맵 크기 변수
const mapWidth = ref(500);
const mapHeight = ref(500);

const characterX = ref(respawnCharacter.value.x);
const characterY = ref(respawnCharacter.value.y);
const characterSize = ref(50);

const scarecrowX = ref(respawnScarecrow.value.x);
const scarecrowY = ref(respawnScarecrow.value.y);
const scarecrowSize = ref(50);
const scarecrowHealth = ref(100);

const speed = ref(200);
let movementInterval = null;

const isAiming = ref(false);
const canThrowSnowball = ref(true);
const mouseX = ref(0);
const mouseY = ref(0);
const targetX = ref(null);
const targetY = ref(null);

const snowballs = ref([]);
const snowballCooldown = 1000; // 쿨타임 (밀리초)
const maxSnowballDistance = 300; // 최대 거리 (픽셀)

const gameContainerStyle = computed(() => ({
  width: `${mapWidth.value}px`,
  height: `${mapHeight.value}px`,
}));

const characterStyle = computed(() => ({
  left: `${characterX.value}px`,
  top: `${characterY.value}px`,
  width: `${characterSize.value}px`,
  height: `${characterSize.value}px`,
}));

const scarecrowStyle = computed(() => ({
  left: `${scarecrowX.value}px`,
  top: `${scarecrowY.value}px`,
  width: `${scarecrowSize.value}px`,
  height: `${scarecrowSize.value}px`,
  backgroundColor: "blue",
  position: "absolute",
  borderRadius: "50%",
}));

const healthBarStyle = computed(() => ({
  width: `${scarecrowHealth.value}px`,
  height: "10px",
  backgroundColor: "green",
  position: "absolute",
  left: `${scarecrowX.value}px`,
  top: `${scarecrowY.value - 15}px`,
}));

const aimStyle = computed(() => {
  const dx = mouseX.value - (characterX.value + characterSize.value / 2);
  const dy = mouseY.value - (characterY.value + characterSize.value / 2);
  const angle = Math.atan2(dy, dx);
  return {
    left: `${characterX.value + characterSize.value / 2}px`,
    top: `${characterY.value + characterSize.value / 2}px`,
    transform: `rotate(${angle}rad)`,
    transformOrigin: "0 50%",
    width: "100px",
    height: "2px",
    backgroundColor: "red",
    position: "absolute",
  };
});

const snowballStyle = (x, y) => ({
  left: `${x}px`,
  top: `${y}px`,
  width: "10px",
  height: "10px",
  position: "absolute",
  backgroundColor: "black",
  borderRadius: "50%",
});

const constrainToSquare = (x, y, container) => {
  const maxX = container.width - characterSize.value;
  const maxY = container.height - characterSize.value;

  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));

  return { x, y };
};

const moveCharacterTo = (event) => {
  if (movementInterval) {
    clearInterval(movementInterval);
  }

  const gameContainer = event.currentTarget.getBoundingClientRect();
  targetX.value = event.clientX - gameContainer.left - characterSize.value / 2;
  targetY.value = event.clientY - gameContainer.top - characterSize.value / 2;

  const { x: constrainedX, y: constrainedY } = constrainToSquare(
    targetX.value,
    targetY.value,
    gameContainer
  );
  targetX.value = constrainedX;
  targetY.value = constrainedY;

  movementInterval = setInterval(() => {
    const dx = targetX.value - characterX.value;
    const dy = targetY.value - characterY.value;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const step = (speed.value / 1000) * 10;

    if (distance < step) {
      characterX.value = targetX.value;
      characterY.value = targetY.value;
      clearInterval(movementInterval);
      movementInterval = null;
    } else {
      const angle = Math.atan2(dy, dx);
      characterX.value += Math.cos(angle) * step;
      characterY.value += Math.sin(angle) * step;

      const { x: constrainedX, y: constrainedY } = constrainToSquare(
        characterX.value,
        characterY.value,
        gameContainer
      );
      characterX.value = constrainedX;
      characterY.value = constrainedY;
    }
  }, 10);
};

const getDistance = (x1, y1, x2, y2) => {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
};

const attackScarecrow = () => {
  const attackRange = 50;
  if (
    getDistance(
      characterX.value,
      characterY.value,
      scarecrowX.value,
      scarecrowY.value
    ) <= attackRange &&
    scarecrowHealth.value > 0
  ) {
    scarecrowHealth.value -= 10;
  }
};

const throwSnowball = (angle) => {
  if (!canThrowSnowball.value) return;
  canThrowSnowball.value = false;

  const snowballId = Date.now();
  const snowballSpeed = 200;
  const startX = characterX.value + characterSize.value / 2;
  const startY = characterY.value + characterSize.value / 2;
  const snowballSize = 10;

  const snowball = {
    id: snowballId,
    x: startX,
    y: startY,
    angle,
    traveled: 0,
    style: snowballStyle(startX, startY),
  };

  snowballs.value.push(snowball);

  const snowballInterval = setInterval(() => {
    snowball.x += (Math.cos(angle) * snowballSpeed) / 10;
    snowball.y += (Math.sin(angle) * snowballSpeed) / 10;
    snowball.traveled += snowballSpeed / 10;

    snowball.style.left = `${snowball.x}px`;
    snowball.style.top = `${snowball.y}px`;

    // 눈덩이가 맵을 벗어나거나 최대 거리 초과 시 제거
    if (
      // snowball.x < 0 ||
      // snowball.x > mapWidth.value ||
      // snowball.y < 0 ||
      // snowball.y > mapHeight.value ||
      snowball.traveled >= maxSnowballDistance
    ) {
      clearInterval(snowballInterval);
      snowballs.value = snowballs.value.filter((sb) => sb.id !== snowballId);
    }

    // 눈덩이가 허수아비에 맞으면 피를 깎고 눈덩이 제거
    if (
      getDistance(
        snowball.x,
        snowball.y,
        scarecrowX.value + scarecrowSize.value / 2,
        scarecrowY.value + scarecrowSize.value / 2
      ) <=
      scarecrowSize.value / 2
    ) {
      scarecrowHealth.value -= 20;
      clearInterval(snowballInterval);
      snowballs.value = snowballs.value.filter((sb) => sb.id !== snowballId);
    }
  }, 10);

  setTimeout(() => {
    canThrowSnowball.value = true;
  }, snowballCooldown);
};

const handleClick = (event) => {
  if (isAiming.value) {
    const dx = mouseX.value - (characterX.value + characterSize.value / 2);
    const dy = mouseY.value - (characterY.value + characterSize.value / 2);
    const angle = Math.atan2(dy, dx);
    throwSnowball(angle);
    isAiming.value = false;
  } else {
    moveCharacterTo(event);
  }
};

const handleKeydown = (event) => {
  if (event.key === "x") {
    attackScarecrow();
  }
  if (event.key === "q") {
    isAiming.value = true;
  }
};

const handleMouseMove = (event) => {
  const gameContainer = document
    .querySelector(".game-container")
    .getBoundingClientRect();
  mouseX.value = event.clientX - gameContainer.left;
  mouseY.value = event.clientY - gameContainer.top;
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("mousemove", handleMouseMove);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("mousemove", handleMouseMove);
  if (movementInterval) clearInterval(movementInterval);
});
</script>

<style scoped>
.game-container {
  position: relative;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  /* overflow: hidden; */
}

.character {
  position: absolute;
  background-color: red;
  border-radius: 50%;
}

.scarecrow {
  position: absolute;
  background-color: blue;
  border-radius: 50%;
}

.health-bar {
  background-color: green;
}

.game-over {
  color: red;
  font-size: 24px;
  font-weight: bold;
}

.aim-indicator {
  background-color: red;
}

.snowball {
  background-color: black;
  border-radius: 50%;
}
</style>
