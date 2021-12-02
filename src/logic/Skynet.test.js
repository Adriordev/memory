import { computerPlayGame } from "./Skynet";

describe("computerPlayGame", () => {
  test("with normal mode should return random cards", () => {
    // Arrange
    const getRandomIndex = jest.fn();

    getRandomIndex.mockReturnValueOnce(3).mockReturnValueOnce(2);
    const cards = {
      value: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
    };
    const shownCards = { value: [] };

    // Act
    const result = computerPlayGame(
      cards,
      "normal",
      shownCards,
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
    const shownCards = { value: [] };

    // Act
    const result = computerPlayGame(
      cards,
      "normal",
      shownCards,
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
    const shownCards = { value: [] };

    // Act
    const result = computerPlayGame(
      cards,
      "normal",
      shownCards,
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
    const shownCards = { value: [{ id: 2 }, { id: 3 }] }; // Although these cards have been shown, they can be returned

    // Act
    const result = computerPlayGame(
      cards,
      "normal",
      shownCards,
      getRandomIndex
    );

    // Assert
    expect(result).toEqual([2, 3]);
  });
});
