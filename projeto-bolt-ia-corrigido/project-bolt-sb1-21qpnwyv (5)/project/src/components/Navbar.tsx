import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SiteSettings {
  logo_url: string;
  site_name: string;
}

export default const Navbar = () {
  const location = useLocation();
  const [settings, setSettings] = useState<SiteSettings>({
    logo_url: '',
    site_name: 'CONSELHO MUNICIPAL DE NAMPULA'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-t-4 border-red-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              {settings.logo_url ? (
                <img 
                  src={settings.logo_url} 
                  alt="Logo"
                  className="h-8 w-auto"
                />
              ) : (
                <Truck className="h-8 w-8 text-red-600" />
              )}
              <div className="ml-2 flex flex-col">
                <span className="text-sm font-bold text-gray-900">
                  CONSELHO MUNICIPAL DE NAMPULA
                </span>
                <span className="text-xs text-red-600 font-medium">
                  DEPARTAMENTO DE TRANSPORTES TECNOLOGIA E TRANSITO
                </span>
              </div>
            </Link>
          </div>
          <div className="flex items-center">
            {location.pathname === '/' ? (
              <Link
                to="/admin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Área Administrativa
              </Link>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100"
              >
                Voltar ao Início
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}