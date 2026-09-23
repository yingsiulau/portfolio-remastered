import { Link } from 'react-router-dom';
import Nav from '@/components/portfolio/Nav';
import ModelViewer from '@/components/portfolio/ModelViewer';

const MODEL_SRC = `${import.meta.env.BASE_URL}models/tripo_pbr_model_b8775148-5339-45b5-ba6f-bb4304f2cbe7_meshopt.glb`;
// Placeholder test upload — not the Akihabara Polycam scan.

export default function ThreeD() {
  return (
    <div className="relative min-h-screen w-full bg-[#1A1A1A] text-white font-body overflow-x-clip antialiased">
      <Nav />

      <main className="relative z-10 w-full min-h-screen flex flex-col pt-32 pb-12 px-6 md:px-12 lg:px-24">
        <div className="w-full flex justify-between items-start mb-8">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50">
            [ /3D ]
          </span>
          <Link
            to="/"
            className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50 hover:text-[#4D4DFF] transition-colors"
          >
            ← Back
          </Link>
        </div>

        <div className="mb-8">
          <span className="text-xs font-mono text-[#4D4DFF] uppercase tracking-widest block mb-3">
            // TEST MODEL
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-light leading-tight tracking-tight mb-3">
            <span className="italic">Test</span>
          </h1>
          <p className="text-sm text-white/50 font-light">
            Placeholder upload for the /3d viewer. Drag to orbit, scroll to zoom.
          </p>
        </div>

        <div className="relative flex-1 min-h-[60vh] rounded-2xl border border-white/10 overflow-hidden bg-[#101014]">
          <ModelViewer src={MODEL_SRC} />
        </div>
      </main>
    </div>
  );
}
