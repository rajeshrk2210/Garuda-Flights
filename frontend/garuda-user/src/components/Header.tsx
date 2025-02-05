import Navbar from "./Navbar";

const Header = ({ user, setUser }: { user: any; setUser: (user: any) => void }) => {
  return (
    <header className="bg-blue-500 p-4">
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
