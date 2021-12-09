import { computerPlayGame } from "./Skynet";

describe("computerPlayGame", () => {
  test("with normal mode should return random cards", () => {
    // Arrange
    const getRandomIndex = jest.fn();

    getRandomIndex.mockReturnValueOnce(3).mockReturnValueOnce(2);
    const cards = {
      value: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
    };
    const cardsShown = { value: [] };

    // Act
    const result = computerPlayGame(
      cards,
      "normal",
      cardsShown,
      getRandomIndex
    );

    // Assert
    expect(result).toEqual([4, 3]);
  });

  test("with normal mode shouldn't return hidden cards", () => {
    // Arrange
    const getRandomIndex = jest.fn();

    getRandomIndex.mockReturnValueOnce(0).mockReturnValueOnce(0);
    const cards = {
      value: [{ id: 1, isHidden: true }, { id: 2 }, { id: 3 }, { id: 4 }],
    };
    const cardsShown = { value: [] };

    // Act
    const result = computerPlayGame(
      cards,
      "normal",
      cardsShown,
      getRandomIndex
    );

    // Assert
    expect(result).toEqual([2, 3]);
  });

  test("with normal mode shouldn't return twice the same card", () => {
    // Arrange
    const getRandomIndex = jest.fn();

    getRandomIndex.mockReturnValueOnce(0).mockReturnValueOnce(0); // Although the same index is returned in subsequent calls, it should not pick the same card twice
    const cards = {
      value: [{ id: 1, isHidden: true }, { id: 2 }, { id: 3 }, { id: 4 }],
    };
    const cardsShown = { value: [] };

    // Act
    const result = computerPlayGame(
      cards,
      "normal",
      cardsShown,
      getRandomIndex
    );

    // Assert
    expect(result).toEqual([2, 3]);
  });

  test("with normal mode the shown cards have no influence", () => {
    // Arrange
    const getRandomIndex = jest.fn();

    getRandomIndex.mockReturnValueOnce(0).mockReturnValueOnce(0);
    const cards = {
      value: [{ id: 1, isHidden: true }, { id: 2 }, { id: 3 }, { id: 4 }],
    };
    const cardsShown = { value: [{ id: 2 }, { id: 3 }] }; // Although these cards have been shown, they can be returned

    // Act
    const result = computerPlayGame(
      cards,
      "normal",
      cardsShown,
      getRandomIndex
    );

    // Assert
    expect(result).toEqual([2, 3]);
  });
  test("with hard mode should return random cards", () => {
    // Arrange
    const getRandomIndex = jest.fn();
    getRandomIndex.mockReturnValueOnce(0).mockReturnValueOnce(0);
    const cards = {
      value: [
        { id: 1, img: 1 },
        { id: 2, img: 2 },
        { id: 3, img: 1 },
        { id: 4, img: 2 },
      ],
    };
    const cardsShown = {
      value: [
        { id: 2, img: 2 },
        { id: 4, img: 2 },
      ],
    };

    // Act
    const result = computerPlayGame(cards, "hard", cardsShown, getRandomIndex);

    // Assert
    expect(result).toEqual([1, 2]);
  });
  test("with hard mode should return random card and her couple", () => {
    // Arrange
    const getRandomIndex = jest.fn();
    getRandomIndex.mockReturnValueOnce(0);
    const cards = {
      value: [
        { id: 1, img: 1 },
        { id: 2, img: 2 },
        { id: 3, img: 1 },
        { id: 4, img: 2 },
      ],
    };
    const cardsShown = {
      value: [
        { id: 2, img: 2 },
        { id: 3, img: 1 },
      ],
    };

    // Act
    const result = computerPlayGame(cards, "hard", cardsShown, getRandomIndex);

    // Assert
    expect(result).toEqual([1, 3]);
  });
  test("with hard mode shouldn't return hidden cards", () => {
    // Arrange
    const getRandomIndex = jest.fn();
    getRandomIndex.mockReturnValueOnce(0);
    const cards = {
      value: [
        { id: 1, img: 1, isHidden: true },
        { id: 2, img: 2 },
        { id: 3, img: 1 },
        { id: 4, img: 2 },
      ],
    };
    const cardsShown = {
      value: [
        { id: 4, img: 2 },
        { id: 3, img: 1 },
      ],
    };

    // Act
    const result = computerPlayGame(cards, "hard", cardsShown, getRandomIndex);

    // Assert
    expect(result).toEqual([2, 4]);
  });
});
