import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Bot, MessageSquare, Zap, Shield } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold  mb-6">
            Your Intelligent AI Companion
          </h1>
          <p className="text-xl  mb-8 max-w-3xl mx-auto">
            Experience seamless, intelligent conversations powered by Google Gemini.
            Login to start chatting instantly.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 rounded-lg transition text-lg font-semibold shadow-lg border"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 border-2 rounded-lg transition text-lg font-semibold"
            >
              Login
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Bot className="w-8 h-8 " />}
            title="AI Powered"
            description="Powered by Google Gemini for intelligent conversations"
          />
          <FeatureCard
            icon={<MessageSquare className="w-8 h-8 " />}
            title="Multiple Projects"
            description="Create unlimited chatbot projects for different use cases"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 " />}
            title="Fast & Reliable"
            description="Lightning-fast responses with 99.9% uptime"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 " />}
            title="Secure"
            description="Bank-level security with JWT authentication"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className=" p-6 rounded-xl shadow-md hover:shadow-xl transition">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold  mb-2">{title}</h3>
    <p className="">{description}</p>
  </div>
);
