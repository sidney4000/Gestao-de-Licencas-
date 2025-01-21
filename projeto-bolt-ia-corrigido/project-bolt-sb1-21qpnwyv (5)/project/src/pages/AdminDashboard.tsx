import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Settings, Upload, Image } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import mammoth from 'mammoth';

// ... (keep existing interfaces)

interface Advertisement {
  id: string;
  image_url: string;
  title: string;
  description: string;
  created_at: string;
}

export default const AdminDashboard = () {
  // ... (keep existing state variables)
  const [showAdsForm, setShowAdsForm] = useState(false);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [adFormData, setAdFormData] = useState({
    image_url: '',
    title: '',
    description: ''
  });
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    checkAuth();
    fetchLicenses();
    fetchSettings();
    fetchAdvertisements();
  }, []);

  const fetchAdvertisements = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setAdvertisements(data);
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error);
      toast.error('Erro ao carregar anúncios');
    }
  };

  // ... (keep existing functions)

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAd) {
        const { error } = await supabase
          .from('advertisements')
          .update(adFormData)
          .eq('id', editingAd.id);

        if (error) throw error;
        toast.success('Anúncio atualizado com sucesso');
      } else {
        const { error } = await supabase
          .from('advertisements')
          .insert([adFormData]);

        if (error) throw error;
        toast.success('Anúncio adicionado com sucesso');
      }
      
      setShowAdsForm(false);
      setEditingAd(null);
      setAdFormData({
        image_url: '',
        title: '',
        description: ''
      });
      fetchAdvertisements();
    } catch (error) {
      console.error('Erro ao salconst anúncio:', error);
      toast.error('Erro ao salconst anúncio');
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este anúncio?')) return;
    
    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Anúncio excluído com sucesso');
      fetchAdvertisements();
    } catch (error) {
      console.error('Erro ao excluir anúncio:', error);
      toast.error('Erro ao excluir anúncio');
    }
  };

  // Update the settings form data to include background_image_url
  const [settingsData, setSettingsData] = useState({
    logo_url: '',
    site_name: '',
    contact_phone: '',
    contact_email: '',
    working_hours: '',
    background_image_url: ''
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* ... (keep existing header) */}

      {/* Advertisement Management Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Gerenciar Anúncios</h2>
          <button
            onClick={() => {
              setEditingAd(null);
              setAdFormData({
                image_url: '',
                title: '',
                description: ''
              });
              setShowAdsForm(true);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Anúncio
          </button>
        </div>

        {showAdsForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-4">
              {editingAd ? 'Editar Anúncio' : 'Novo Anúncio'}
            </h3>
            <form onSubmit={handleAdSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">URL da Imagem</label>
                <input
                  type="url"
                  value={adFormData.image_url}
                  onChange={(e) => setAdFormData({ ...adFormData, image_url: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  value={adFormData.title}
                  onChange={(e) => setAdFormData({ ...adFormData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  value={adFormData.description}
                  onChange={(e) => setAdFormData({ ...adFormData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdsForm(false);
                    setEditingAd(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  {editingAd ? 'Atualizar' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {advertisements.map((ad) => (
                <tr key={ad.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={ad.image_url} alt={ad.title} className="h-12 w-20 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{ad.title}</td>
                  <td className="px-6 py-4">{ad.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingAd(ad);
                          setAdFormData({
                            image_url: ad.image_url,
                            title: ad.title,
                            description: ad.description
                          });
                          setShowAdsForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showSettingsForm && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Configurações do Site</h2>
          <form onSubmit={handleSettingsSubmit} className="space-y-4">
            {/* ... (keep existing settings fields) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Imagem de Fundo</label>
              <input
                type="url"
                value={settingsData.background_image_url}
                onChange={(e) => setSettingsData({ ...settingsData, background_image_url: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="https://exemplo.com/fundo.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                URL da imagem de fundo do site (deixe em branco para usar o fundo padrão)
              </p>
            </div>
            {/* ... (keep existing buttons) */}
          </form>
        </div>
      )}

      {/* ... (keep existing content) */}
    </div>
  );
}