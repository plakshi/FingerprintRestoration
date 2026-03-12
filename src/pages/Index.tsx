import RestorePanel from '@/components/RestorePanel';
import heroImage from '@/assets/hero-fingerprint.jpg';
import { Fingerprint, Shield, Zap, Download, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { logout } = useAuth();
  const handleGetStarted = () => {
    document.getElementById('tool')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-lg bg-background/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Fingerprint className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg gradient-primary-text">RidgeRestore</span>
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={logout}>
              Logout
            </Button>

            <Button size="sm" onClick={handleGetStarted} className="bg-primary text-primary-foreground hover:bg-primary/90 glow">
            Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary text-sm font-medium font-mono">AI-Powered Forensic Enhancement</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
            Restore Damaged
            <br />
            <span className="gradient-primary-text text-glow">Fingerprints</span>
          </h1>

          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload degraded, partial, or low-quality fingerprint images and get sharp, 
            ridge-enhanced restorations — ready to download in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="h-13 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 font-semibold glow animate-pulse-glow gap-2"
            >
              Start Restoring
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-16">
            {[
              { value: '1', label: 'File Format (TIF)' },
              { value: '3x', label: 'Ridge Detail' },
              { value: '< 5s', label: 'Processing' },
            ].map(stat => (
              <div key={stat.label} className="gradient-card border-glow rounded-xl p-4">
                <p className="text-2xl font-bold gradient-primary-text">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Forensic-Grade Processing</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Advanced image processing algorithms designed for law enforcement, forensic labs, and security professionals.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: <Shield className="w-6 h-6" />,
              title: 'Ridge Enhancement',
              desc: 'Unsharp masking and contrast boost reveals hidden ridge details in degraded prints.',
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Instant Processing',
              desc: 'Client-side processing means your sensitive biometric data never leaves your device.',
            },
            {
              icon: <Download className="w-6 h-6" />,
              title: 'Download Ready',
              desc: 'Export your restored fingerprint as a high-quality PNG, ready for analysis or reporting.',
            },
          ].map(feat => (
            <div key={feat.title} className="gradient-card border-glow rounded-2xl p-6 hover:border-primary/40 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 text-primary group-hover:glow transition-all">
                {feat.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feat.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tool Section */}
      <section id="tool" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-primary-text">Restore Your Fingerprint</span>
          </h2>
          <p className="text-muted-foreground">Upload a TIFF file to begin</p>
        </div>
        <RestorePanel />
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">RidgeRestore</span>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            All processing is done locally in your browser. No biometric data is transmitted.
          </p>
          <p className="text-xs text-muted-foreground">© 2025 RidgeRestore</p>
        </div>
      </footer>
    </div>
  );
}
