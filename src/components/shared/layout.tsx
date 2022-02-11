function Layout({ children, divProp }) {
  return (
    <div className="flex w-auto h-full justify-center items-center">
      <div className={`flex bg-gray-900 rounded p-8 gap-4 ${divProp}`}>
        { children }
      </div>
    </div>
  );
}

export default Layout;
