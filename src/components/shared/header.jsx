function Header({ title, onClick, bTitle }) {
  return (
    <div className="flex justify-between gap-10 p-6">
      <span className="text-2xl font-semibold text-white text-center">
        {title}
      </span>
      <button
        type="button"
        className="bg-teal-800 hover:bg-teal-600 text-white rounded p-2"
        onClick={onClick}
      >
        {bTitle}
      </button>
    </div>
  );
}

export default Header;
