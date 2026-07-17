import React, { useEffect, useState } from 'react';
import { Search, Heart, Trash2, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import { advertisementAPI } from '../../services/api';
import AdvertisementResult from './AdvertisementResult';

export default function AdvertisementHistory() {
  const showToast = useToast();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFav, setFilterFav] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await advertisementAPI.getHistory();
      setHistory(data);
    } catch (err) {
      showToast('Failed to load history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await advertisementAPI.deleteHistory(id);
      setHistory(history.filter(h => h.id !== id));
      showToast('Deleted record', 'info');
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  const handleFavorite = async (id, currentStatus) => {
    try {
      await advertisementAPI.favorite(id, !currentStatus);
      setHistory(history.map(h => h.id === id ? { ...h, favorite: !currentStatus } : h));
    } catch (err) {
      showToast('Failed to update favorite', 'error');
    }
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.campaign_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFav = filterFav ? item.favorite : true;
    return matchesSearch && matchesFav;
  });

  if (loading) {
    return <div className="p-8 text-center text-white/50"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-4" /> Loading History...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search by campaign name or brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-neon-pink"
          />
        </div>
        <button 
          onClick={() => setFilterFav(!filterFav)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-2 ${filterFav ? 'bg-neon-pink/20 text-neon-pink border-neon-pink/30' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
        >
          <Heart className="w-4 h-4" fill={filterFav ? 'currentColor' : 'none'} /> Favorites
        </button>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="text-center p-12 glass-panel rounded-2xl border border-white/10 text-white/50 text-sm">
          No ad campaigns found.
        </div>
      ) : (
        <div className="space-y-8">
          {filteredHistory.map(record => (
            <div key={record.id} className="glass-panel p-6 rounded-3xl border border-white/10">
              <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{record.campaign_name || 'Untitled Campaign'}</h3>
                  <p className="text-[10px] text-white/40 mt-1 uppercase tracking-widest">{record.brand} • {record.platform} • {new Date(record.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleFavorite(record.id, record.favorite)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors">
                    <Heart className="w-4 h-4" fill={record.favorite ? '#6b7280' : 'none'} color={record.favorite ? '#6b7280' : 'currentColor'} />
                  </button>
                  <button onClick={() => handleDelete(record.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {record.generated_content.map((post, idx) => (
                  <AdvertisementResult 
                    key={idx} 
                    post={post} 
                    idx={idx}
                    onRegenerate={() => showToast('Regeneration from history not available yet', 'warning')}
                    onDownload={(type) => showToast(`Download as ${type} starting...`, 'info')}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
