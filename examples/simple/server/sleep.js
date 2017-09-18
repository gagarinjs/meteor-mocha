import Future from 'fibers/future';

const sleep = (ms, err) => {
  const future = new Future();
  setTimeout(() => {
    if (err) {
      future.throw(err);
    } else {
      future.return();
    }
  }, ms);
  return future.wait();
};

export default sleep;
