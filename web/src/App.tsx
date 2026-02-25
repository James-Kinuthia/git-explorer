import { useState } from "react"
import NavButton from "./components/NavButton";
import ProfileView from "./components/ProfileView";
import RepoExplorer from "./components/RepoExplorer";


function App() {
  const [activeTab, setActiveTab] = useState('profile');


  return (
     <div className="h-screen flex flex-col overflow-x-hidden">
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-white">Github Explorer</h1>
            <div className="flex gap-4">
              <NavButton onClick={() => setActiveTab('profile')} isActive={activeTab === 'profile'}>
                Profile Viewer
              </NavButton>
              <NavButton onClick={() => setActiveTab('repos')} isActive={activeTab === 'repos'}>
                Repo Explorer
              </NavButton>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 overflow-auto">
        {activeTab === 'profile' ? <ProfileView /> : <RepoExplorer />}
      </main>
    </div>
  )
}

export default App
