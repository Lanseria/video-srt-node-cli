function add(a: number, b: number): number {
  return a + b;
}

describe('add function', () => {
  it('1 + 1 = 2', () => {
    console.log('普通测试');
    expect(add(1, 1)).toEqual(2);
  });
});
