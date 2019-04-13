import { LCMessage, LCMessageError } from './message';

test('invalid type', () => {
  const msg = new LCMessage();
  expect(msg.validate()).toEqual(LCMessageError.TYPE_MISSING);
});
