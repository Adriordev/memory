<template>
  <div class="generate-board">
    <h3>Board</h3>
    <label for="couplesCount">Numero de parejas: </label>
    <input
      type="number"
      v-model="couplesCount"
      @keyup.enter="createCards((visible = true))"
    />
    <button @click="createCards((visible = true))">crear</button>
  </div>
  <div v-if="visible === true">
    <h3>Cartas ganadas jugador: {{ counter.human }}</h3>
    <h3>Cartas ganadas maquina: {{ counter.computer }}</h3>
  </div>

  <div
    class="board-container"
    :class="{ 'not-pointer': turnSelector.notPointer }"
  >
    <Card
      v-bind="item"
      @handleFlip="flipCard"
      v-for="item in cards"
      :key="item.id"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import Card from "./Card.vue";
import axios from "axios";
export default {
  components: {
    Card,
  },

  setup() {
    const couplesCount = ref();
    const cards = ref([]);
    //depende del modo de juego que queramos crear, si es por rondas o por juegos independientes
    const counter = ref({ human: 0, computer: 0 });
    const turnSelector = ref({ notPointer: false, turnComputer: false });

    const createCards = async () => {
      cards.value = [];
      counter.value = { human: 0, computer: 0 };
      turnSelector.value = { notPointer: false, turnComputer: false };

      const response = await axios.get(
        `https://picsum.photos/v2/list?limit=${couplesCount.value}`
      );
      const images = response.data.map((img) => img.download_url);

      for (let index = 0; index < images.length; index++) {
        const cardA = {
          id: `${index}A`,
          text: index,
          isFlipped: false,
          isHidden: false,
          img: images[index],
        };
        cards.value.push(cardA);

        const cardB = {
          id: `${index}B`,
          text: index,
          isFlipped: false,
          isHidden: false,
          img: images[index],
        };
        cards.value.push(cardB);
      }
      shuffle(cards.value);
    };

    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    const flipCard = (id) => {
      const selectCardtoFlip = cards.value.find((c) => c.id === id);
      selectCardtoFlip.isFlipped = true;

      checkIfCoupleWasFound();
    };

    const checkIfCoupleWasFound = () => {
      const flippedCards = cards.value.filter((card) => card.isFlipped);
      if (flippedCards.length < 2) return;
      turnSelector.value.notPointer = true;
      if (flippedCards[0].img === flippedCards[1].img) {
        if (turnSelector.value.turnComputer === true) {
          counter.value.computer += 1;
          turnSelector.value.turnComputer = !turnSelector.value.turnComputer;
        } else {
          counter.value.human += 1;
          turnSelector.value.turnComputer = !turnSelector.value.turnComputer;
        }
        flippedCards.forEach((element) => {
          element.isHidden = true;
        });
      }
      turnSelector.value.turnComputer = !turnSelector.value.turnComputer;
      flipSelectedCards(2000, flippedCards, turnSelector);
    };

    const flipSelectedCards = (ms, flippedCards, changeTurn) => {
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            flippedCards.forEach((element) => {
              element.isFlipped = false;
            })
          );
          console.log("changeTurn.value :>> ", changeTurn.value);
          if (changeTurn.value.turnComputer === true) {
            computerPlayGame();
          } else {
            changeTurn.value.notPointer = false;
          }
        }, ms);
      });
    };

    const computerPlayGame = async () => {
      await sleep(2000);
      const possibleCards = cards.value.filter((card) => {
        return card.isHidden === false;
      });
      if (possibleCards.length === 0) return;

      for (let index = 0; index < 2; index++) {
        const rolled = rollCard(possibleCards);
        flipCard(possibleCards[rolled].id);
        possibleCards.splice(rolled, 1);
        await sleep(500);
      }
    };

    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    const rollCard = (possibleCards) => {
      return Math.floor(Math.random() * (possibleCards.length - 0)) + 0;
    };

    return {
      couplesCount,
      cards,
      createCards,
      flipCard,
      Card,
      counter,
      visible: ref(false),
      computerPlayGame,
      turnSelector,
    };
  },
};
</script>

<style>
.generate-board {
  text-align: center;
  padding: 15px 0px 15px 0px;
  margin: 0 auto;
}
.board-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0px 100px 0px 100px;
  gap: 5px 5px;
}
.board-container.not-pointer {
  pointer-events: none;
  cursor: not-allowed;
}
</style>
