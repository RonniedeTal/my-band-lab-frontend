import React from 'react';
import { CreateGroupForm } from '../components/CreateGroupForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CreateGroupPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/groups"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a grupos
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Crear Nuevo Grupo
          </h1>
          <p className="text-gray-400 mt-2">Forma tu banda y comienza a hacer música</p>
        </div>

        <CreateGroupForm />
      </div>
    </div>
  );
};
export default CreateGroupPage;
