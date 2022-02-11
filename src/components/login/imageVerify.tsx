function ImageVerify({ user }) {
  if (user.length < 3) {
    return (
      <img
        className="rounded-full max-h-[10rem] max-w-[10rem]"
        alt=""
        src="https://github.com/github.png"
      />
    );
  }
  console.log(user.length);
  return (
    <img
      className="rounded-full max-h-[10rem] max-w-[10rem]"
      alt=""
      src={`https://github.com/${user}.png`}
    />
  );
}

export default ImageVerify;
