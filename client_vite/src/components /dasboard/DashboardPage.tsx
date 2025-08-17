//@ts-nocheck
import React, { useState } from 'react';
import { 
  Search, Bell, Settings, User, Grid3X3, List, 
  Filter, MoreVertical, Share, Star, Download,
  FileText, File, Folder, Image, Video, Music,
  Calendar, Clock, HardDrive, Plus, Upload
} from 'lucide-react';

const DashboardPage = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [selectedTab, setSelectedTab] = useState('recent'); // 'all', 'recent'
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Mock file data based on your OneDrive screenshot
  const files = [
    {
      id: 1,
      name: 'Joshua Kerievsky - Refactoring to Patterns (2004, Addison-Wesley)',
      type: 'pdf',
      size: '14.47 MB',
      modified: 'pena klo 14.47',
      owner: 'tomi west',
      location: 'Omat tiedostot > Personal > ... > macb...',
      shared: false,
      icon: FileText
    },
    {
      id: 2,
      name: 'Thailand_Cambodia_Vietnam_Overland_Itinerary',
      type: 'document',
      size: '2.1 MB',
      modified: '26. toutok.',
      owner: 'tomi west',
      location: 'Omat tiedostot > Personal > ... > macb...',
      shared: false,
      icon: FileText
    },
    {
      id: 3,
      name: 'pdfcoffee.com_kostka-harmony-8th-ed-p...',
      type: 'pdf',
      size: '8.3 MB',
      modified: 'pena klo 14.47',
      owner: 'tomi west',
      location: 'Omat tiedostot > Personal > ... > macb...',
      shared: true,
      starred: true,
      icon: FileText
    },
    {
      id: 4,
      name: 'TLCL-19.01',
      type: 'pdf',
      size: '1.2 MB',
      modified: '22. helmik.',
      owner: 'tomi west',
      location: 'Omat tiedostot > Personal > ... > Macb...',
      shared: false,
      icon: FileText
    },
    {
      id: 5,
      name: 'sql-antipatterns-avoiding-the-pitfalls-of-database-progra...',
      type: 'pdf',
      size: '5.7 MB',
      modified: '22. helmik.',
      owner: 'tomi west',
      location: 'Omat tiedostot > Personal > ... > Macb...',
      shared: false,
      icon: FileText
    },
    {
      id: 6,
      name: 'Katherine Cox-Buday - Concurrency in Go_ Tools and Tec...',
      type: 'pdf',
      size: '3.1 MB',
      modified: '7. kesäk.',
      owner: 'tomi west',
      location: 'Omat tiedostot > Personal > ... > macb...',
      shared: false,
      icon: FileText
    },
    {
      id: 7,
      name: '60160370-Searl-20th-Century-Counterpoint',
      type: 'pdf',
      size: '12.8 MB',
      modified: '16. lokak. 2023',
      owner: 'tomi west',
      location: 'Omat tiedostot > Personal > ... > Sribd',
      shared: false,
      icon: FileText
    }
  ];

  const getFileIcon = (file) => {
    const IconComponent = file.icon;
    return <IconComponent className="h-5 w-5 text-red-600" />;
  };

  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const FileRow = ({ file }) => (
    <div 
      className={`flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer ${
        selectedFiles.includes(file.id) ? 'bg-blue-50' : ''
      }`}
      onClick={() => toggleFileSelection(file.id)}
    >
      <div className="flex items-center flex-1 min-w-0">
        <input
          type="checkbox"
          checked={selectedFiles.includes(file.id)}
          onChange={() => toggleFileSelection(file.id)}
          className="mr-3 rounded border-gray-300"
        />
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="bg-red-50 p-2 rounded">
            {getFileIcon(file)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">Tekijä: {file.owner}</p>
          </div>
        </div>
      </div>
      
      <div className="hidden md:flex items-center space-x-8 text-sm text-gray-500">
        <div className="w-24 text-right">{file.modified}</div>
        <div className="w-24 text-right">{file.owner}</div>
        <div className="w-48 truncate">{file.location}</div>
      </div>
      
      <div className="flex items-center space-x-2 ml-4">
        {file.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
        {file.shared && <Share className="h-4 w-4 text-blue-500" />}
        <button className="p-1 hover:bg-gray-200 rounded">
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">OneDrive</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>archive</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Haku"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
                <Settings className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                TW
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <button className="w-full flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              <span>Luo tai lataa</span>
            </button>
          </div>
          
          <nav className="px-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-500 px-3 py-2">tomi west</div>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <HardDrive className="h-4 w-4" />
                <span>Aloitus</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 bg-blue-50 text-blue-700 rounded-md">
                <Folder className="h-4 w-4" />
                <span>Omat tiedostot</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <User className="h-4 w-4" />
                <span>Jaettu</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <Star className="h-4 w-4" />
                <span>Suosikit</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <HardDrive className="h-4 w-4" />
                <span>Roskakori</span>
              </a>
            </div>
            
            <div className="mt-8">
              <div className="text-sm font-medium text-gray-500 px-3 py-2">Selaa tiedostoja</div>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <User className="h-4 w-4" />
                <span>Ihmiset</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <Calendar className="h-4 w-4" />
                <span>Kokousket</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                <Image className="h-4 w-4" />
                <span>Media</span>
              </a>
            </div>
            
            <div className="mt-8">
              <div className="text-sm font-medium text-gray-500 px-3 py-2">Pikakäyttö</div>
              <a href="#" className="flex items-center space-x-3 px-3 py-2 text-blue-600 hover:bg-gray-100 rounded-md">
                <Music className="h-4 w-4" />
                <span>Plektra Musik</span>
              </a>
            </div>

            <div className="mt-8 px-3">
              <div className="text-xs text-gray-500">Tallennustila</div>
              <div className="text-xs text-gray-400 mt-1">386,7 Gt käyttöstä 1 Tt käytettävissä (37 %)</div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Content Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Hakutulokset</h2>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500">Omat tiedostot</div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex items-center space-x-6 mt-4">
              <button 
                className={`pb-2 text-sm font-medium border-b-2 ${
                  selectedTab === 'all' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setSelectedTab('all')}
              >
                Kaikki tiedostot
              </button>
              <button 
                className={`pb-2 text-sm font-medium border-b-2 ${
                  selectedTab === 'recent' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setSelectedTab('recent')}
              >
                Omat tiedostot
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Kaikki päivämäärät</span>
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Kaikki</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* File List */}
          <div className="bg-white">
            {/* Table Header */}
            <div className="hidden md:flex items-center p-3 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex items-center flex-1">
                <input type="checkbox" className="mr-3 rounded border-gray-300" />
                <span>Nimi</span>
              </div>
              <div className="w-24 text-right">Muokattu</div>
              <div className="w-24 text-right ml-8">Muokkaaja</div>
              <div className="w-48 ml-8">Sijainti</div>
              <div className="w-16"></div>
            </div>

            {/* File Rows */}
            <div>
              {files.map(file => (
                <FileRow key={file.id} file={file} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;