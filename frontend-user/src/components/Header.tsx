import Navbar from "./Navbar";

const Header = ({ user, setUser }: { user: any; setUser: (user: any) => void }) => {
  return (
    <header className="bg-blue-600 p-4 shadow-md fixed w-full z-50 top-0 left-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Company Name */}
        <h1 className="text-white text-3xl font-semibold">Garuda Flights</h1>

        {/* Navbar */}
        <Navbar user={user} setUser={setUser} />
      </div>
    </header>
  );
};

export default Header;
