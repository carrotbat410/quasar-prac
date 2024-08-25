<template>
  <q-page class="flex flex-center">
    <div class="game-container">
      <!-- 캐릭터 -->
      <div class="character" :style="characterStyle"></div>

      <!-- 허수아비 -->
      <div class="scarecrow" :style="scarecrowStyle"></div>

      <!-- 허수아비의 체력 -->
      <div
        v-if="scarecrowHealth > 0"
        class="health-bar"
        :style="healthBarStyle"
      ></div>
      <div v-if="scarecrowHealth <= 0" class="game-over">Game Over</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// 캐릭터의 위치와 크기
const characterX = ref(50);
const characterY = ref(50);
const characterSize = ref(50);

// 허수아비의 위치와 체력
const scarecrowX = ref(200);
const scarecrowY = ref(200);
const scarecrowSize = ref(50);
const scarecrowHealth = ref(300); // 허수아비의 초기 체력

// 캐릭터의 스타일
const characterStyle = computed(() => ({
  left: `${characterX.value}px`,
  top: `${characterY.value}px`,
  width: `${characterSize.value}px`,
  height: `${characterSize.value}px`,
}));

// 허수아비의 스타일
const scarecrowStyle = computed(() => ({
  left: `${scarecrowX.value}px`,
  top: `${scarecrowY.value}px`,
  width: `${scarecrowSize.value}px`,
  height: `${scarecrowSize.value}px`,
  backgroundColor: "blue",
  position: "absolute",
  borderRadius: "50%",
}));

// 허수아비의 체력바 스타일
const healthBarStyle = computed(() => ({
  width: `${scarecrowHealth.value}px`,
  height: "10px",
  backgroundColor: "green",
  position: "absolute",
  left: `${scarecrowX.value}px`,
  top: `${scarecrowY.value - 15}px`, // 허수아비 위에 위치
}));

// 이동하는 방향을 추적할 Set
const keysPressed = new Set();

// 캐릭터 이동 로직
const moveCharacter = () => {
  const step = 10;

  if (keysPressed.has("ArrowUp")) {
    if (characterY.value > 0) characterY.value -= step;
  }
  if (keysPressed.has("ArrowDown")) {
    if (characterY.value < 300 - characterSize.value) characterY.value += step;
  }
  if (keysPressed.has("ArrowLeft")) {
    if (characterX.value > 0) characterX.value -= step;
  }
  if (keysPressed.has("ArrowRight")) {
    if (characterX.value < 300 - characterSize.value) characterX.value += step;
  }
};

// 캐릭터와 허수아비 사이의 거리 계산
const getDistance = () => {
  const dx = characterX.value - scarecrowX.value;
  const dy = characterY.value - scarecrowY.value;
  return Math.sqrt(dx * dx + dy * dy);
};

// 공격 범위 내에 있는지 확인하고 허수아비 체력 감소
const attackScarecrow = () => {
  const attackRange = 50; // 공격 범위
  if (getDistance() <= attackRange && scarecrowHealth.value > 0) {
    scarecrowHealth.value -= 10; // 공격 시 허수아비의 체력을 10 감소
  }
};

// 반복적으로 캐릭터를 움직이도록 설정
let movementInterval = null;
const startMovement = () => {
  if (movementInterval) return;

  movementInterval = setInterval(() => {
    moveCharacter();
  }, 50);
};

// 이동 멈추기
const stopMovement = () => {
  if (movementInterval) {
    clearInterval(movementInterval);
    movementInterval = null;
  }
};

// 키 다운 처리
const handleKeydown = (event) => {
  keysPressed.add(event.key);
  if (event.key === "x" || event.key === "ㅌ") {
    attackScarecrow();
  } else {
    startMovement();
  }
};

// 키 업 처리
const handleKeyup = (event) => {
  keysPressed.delete(event.key);
  if (keysPressed.size === 0) {
    stopMovement();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("keyup", handleKeyup);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("keyup", handleKeyup);
  stopMovement(); // 컴포넌트 언마운트 시 이동 멈춤
});
</script>

<style scoped>
.game-container {
  width: 300px;
  height: 300px;
  background-color: #f0f0f0;
  position: relative;
  border: 2px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
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
  position: absolute;
  background-color: green;
}

.game-over {
  position: absolute;
  color: red;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
