interface SearchBoxProps {
  setSearch: (searchValue: string) => void
}
export const SearchBox = ({ setSearch }: SearchBoxProps) => (
  <div className="relative w-full">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5 text-gray-400 absolute left-3 inset-y-0 my-auto"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>

    <input
      onChange={(e) => setSearch(e.target.value)}
      type="text"
      className="w-full pl-12 pr-3 py-2 bg-white text-sm text-gray-500 bg-transparent outline-none border ring-blue-600 focus:ring-2 shadow-sm rounded-lg duration-200"
    />
  </div>
)
