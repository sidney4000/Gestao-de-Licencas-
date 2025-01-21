import React, { useState, useEffect } from 'react';
import { Truck, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface License {
  id: string;
  full_name: string;
  license_plate: string;
  status: string;
  pickup_location: string;
  updated_at: string;
}

interface Advertisement {
  id: string;
  image_url: string;
  title: string;
  description: string;
}

interface SiteSettings {
  background_image_url: string;
}

export default const Home = () {
  const [fullName, setFullName] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<License | null>(null);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ background_image_url: '' });
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    fetchAds();
    fetchSettings();

    // Rotate ads every 5 seconds
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => 
        ads.length ? (prevIndex + 1) % ads.length : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [ads.length]);

  const fetchAds = async () => {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setAds(data);
    } catch (error) {
      console.error('Erro ao carregar anúncios:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('background_image_url')
        .single();

      if (error) throw error;
      if (data) setSettings(data);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const checkLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .ilike('full_name', fullName.trim())
        .ilike('license_plate', licensePlate.trim())
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setResult(data);
      } else {
        toast.error('Nenhuma licença encontrada com os dados fornecidos');
      }
    } catch (error) {
      console.error('Erro ao verificar licença:', error);
      toast.error('Erro ao verificar licença');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const backgroundStyle = settings.background_image_url ? {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${settings.background_image_url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed'
  } : {};

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Truck className="h-16 w-16 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Consulta de Licença
            </h1>
            <p className="text-lg text-red-600">
              Verifique o estado da sua licença de transporte
            </p>
          </div>

          {/* Advertisement Section */}
          {ads.length > 0 && (
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {ads[currentAdIndex] && (
                  <div className="relative">
                    <img
                      src={ads[currentAdIndex].image_url}
                      alt={ads[currentAdIndex].title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-white font-semibold text-lg">
                        {ads[currentAdIndex].title}
                      </h3>
                      <p className="text-white text-sm">
                        {ads[currentAdIndex].description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-red-600">
            <form onSubmit={checkLicense} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
                  Matrícula do Veículo
                </label>
                <input
                  type="text"
                  id="licensePlate"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  'Verificando...'
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Verificar Licença
                  </>
                )}
              </button>
            </form>

            {result && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border-l-4 border-red-600">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resultado da Consulta</h3>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Nome:</span> {result.full_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Matrícula:</span> {result.license_plate}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={
                        result.status === 'ready'
                          ? 'text-green-600 font-semibold'
                          : 'text-red-600 font-semibold'
                      }
                    >
                      {result.status === 'ready' ? 'Disponível para Levantar' : 'Em Processamento'}
                    </span>
                  </p>
                  {result.status === 'ready' && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Local de Levantamento:</span>{' '}
                      {result.pickup_location}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Última Atualização:</span>{' '}
                    {formatDate(result.updated_at)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}