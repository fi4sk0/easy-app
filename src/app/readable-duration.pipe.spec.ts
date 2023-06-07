import { ReadableDurationPipe } from './readable-duration.pipe';

describe('ReadableDurationPipe', () => {
  it('create an instance', () => {
    const pipe = new ReadableDurationPipe();
    expect(pipe).toBeTruthy();
  });
});
