import Navbar from "./Navbar";

const Header = ({ admin, setAdmin }: { admin: any; setAdmin: (admin: any) => void }) => {
  return (
    <header className="bg-blue-600 p-4 shadow-md fixed w-full z-50 top-0 left-0">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Company Name */}
        <h1 className="text-white text-3xl font-semibold">Garuda Flights Admin</h1>

        {/* Navbar */}
        <Navbar admin={admin} setAdmin={setAdmin} />
      </div>
    </header>
  );
};

export default Header;
