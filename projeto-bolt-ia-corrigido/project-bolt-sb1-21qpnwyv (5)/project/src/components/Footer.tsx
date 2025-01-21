import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SiteSettings {
  contact_phone: string;
  contact_email: string;
  working_hours: string;
  site_name: string;
}

export default const Footer = () {
  const [settings, setSettings] = useState<SiteSettings>({
    contact_phone: '(XX) XXXX-XXXX',
    contact_email: 'contato@dtct.gov',
    working_hours: 'Segunda a Sexta: 8h às 17h\nSábado: 8h às 12h',
    site_name: 'DTCT'
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
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">DTCT</h3>
            <p className="text-gray-300">
              Facilitando o processo de licenciamento de transportes para melhor servir nossa comunidade.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Horário de Funcionamento</h3>
            <p className="text-gray-300 whitespace-pre-line">{settings.working_hours}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <p className="text-gray-300">Telefone: {settings.contact_phone}</p>
            <p className="text-gray-300">Email: {settings.contact_email}</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} DTCT. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}