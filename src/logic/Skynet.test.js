import * as Skynet from "./Skynet";

test("adds 1 + 2 to equal 3", () => {
  expect(Skynet.sum(1, 2)).toBe(3);
});
