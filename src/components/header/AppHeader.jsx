import Logo from '../../assets/logo-azul.png'
export default function AppHeader({user}) {

  // Array of colors for Avatar
  const colors = [
    "#4ADE80",
    "#60A5FA",
    "#F87171",
    "#FACC15",
    "#FB923C",
    "#A16207",
    "#A78BFA"
  ];

  // Create avatar icon
  const firstLetter = user.first_name[0].toUpperCase();
  const colorIndex = firstLetter.charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIndex];

  return(
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="https://flowbite.com" className="flex items-center">
            <img src={Logo} className="mr-3 h-6 sm:h-9" alt="Site Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Organizador</span>
          </a>
          <div
            style={{ backgroundColor: avatarColor }}
            className="
              flex items-center justify-center
              h-7 w-7 rounded-md
              text-white font-medium
              transition-all duration-300
              hover:ring-3 hover:ring-gray-300/30
              cursor-pointer select-none
            "
          >
            {firstLetter}
          </div>
        </div>
      </nav>
    </header>
  )
}