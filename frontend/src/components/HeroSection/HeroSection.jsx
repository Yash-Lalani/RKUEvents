import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-grid">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:flex-grow flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 backdrop-blur-md inline-block"
          >
            ✨ The Ultimate University Experience
          </motion.div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
            Discover the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500">
              Best Events
            </span>
          </h1>
          
          <p className="mb-10 text-lg lg:text-xl text-gray-400 max-w-xl leading-relaxed">
            Join a vibrant community of passionate learners. From thrilling hackathons to insightful workshops, reserve your spot today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/events")}
              className="px-8 py-4 rounded-xl bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow duration-300"
            >
              Explore Events
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              className="px-8 py-4 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Join RKUEvents
            </motion.button>
          </div>
        </motion.div>

        {/* Dynamic Image / Visual */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 flex justify-center relative"
        >
          <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(99,102,241,0.2)] border border-white/10">
            {/* Using a placeholder gradient pattern since we removed standard static images, feel free to link heroImg back */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-3xl" />
            
            {/* Abstract floating shapes for premium look */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl opacity-60 blur-md"
            />
            <motion.div 
              animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-bl from-purple-500 to-pink-500 rounded-full opacity-60 blur-md"
            />
            
            <div className="absolute inset-0 glass flex items-center justify-center p-8 backdrop-blur-md">
                <div className="text-center">
                   <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">Connect & Learn</h3>
                   <p className="text-gray-400 mt-2">Elevate your campus journey.</p>
                </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
