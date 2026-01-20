// app.js
class QRTechGenerator {
    constructor() {
        this.qrCode = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.createParticles();
    }

    bindEvents() {
        const generateBtn = document.getElementById('generateBtn');
        const urlInput = document.getElementById('urlInput');
        const downloadBtn = document.getElementById('downloadBtn');
        const copyBtn = document.getElementById('copyBtn');
        const qrContainer = document.getElementById('qrContainer');

        generateBtn.addEventListener('click', () => this.generateQR());
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.generateQR();
        });
        downloadBtn.addEventListener('click', () => this.downloadQR());
        copyBtn.addEventListener('click', () => this.copyQR());
    }

    async generateQR() {
        const url = document.getElementById('urlInput').value.trim();
        
        if (!url) {
            this.showError('Please enter a valid URL');
            return;
        }

        if (!this.isValidUrl(url)) {
            this.showError('Please enter a valid URL (starting with http:// or https://)');
            return;
        }

        try {
            const qrContainer = document.getElementById('qrContainer');
            qrContainer.innerHTML = '<div class="loading">Generating QR Code...</div>';

            this.qrCode = await QRCode.toCanvas(document.createElement('canvas'), url, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#00f5ff',
                    light: '#1a1a2e'
                }
            });

            qrContainer.innerHTML = '';
            qrContainer.appendChild(this.qrCode);

            document.getElementById('downloadBtn').disabled = false;
            document.getElementById('copyBtn').disabled = false;

            this.addSuccessEffect();
        } catch (error) {
            this.showError('Failed to generate QR code. Please try again.');
            console.error('QR Generation Error:', error);
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    downloadQR() {
        if (!this.qrCode) return;

        const link = document.createElement('a');
        link.download = `qr-tech-${Date.now()}.png`;
        
        // Convert canvas to image
        const image = this.qrCode.toDataURL('image/png');
        link.href = image;
        link.click();
    }

    async copyQR() {
        if (!this.qrCode) return;

        try {
            const canvas = this.qrCode;
            canvas.toBlob(async (blob) => {
                const data = [new ClipboardItem({ 'image/png': blob })];
                await navigator.clipboard.write(data);
                this.showToast('QR Code copied to clipboard!');
            });
        } catch (err) {
            this.showError('Failed to copy QR code');
            console.error('Copy Error:', err);
        }
    }

    showError(message) {
        const qrContainer = document.getElementById('qrContainer');
        qrContainer.innerHTML = `
            <div class="error-message">
                <div style="color: #ff6b6b; font-size: 4rem;">⚠️</div>
                <p>${message}</p>
            </div>
        `;
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    addSuccessEffect() {
        const qrContainer = document.getElementById('qrContainer');
        qrContainer.style.transform = 'scale(0.95)';
        setTimeout(() => {
            qrContainer.style.transform = 'scale(1)';
        }, 150);
    }

    createParticles() {
        const particles = document.querySelector('.particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particles.appendChild(particle);
        }
    }
}

// Add CSS for additional elements
const style = document.createElement('style');
style.textContent = `
    .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 300px;
        font-size: 1.2rem;
        color: #00f5ff;
    }
    
    .error-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
        color: #ff6b6b;
    }
    
    .error-message p {
        margin-top: 15px;
        font-size: 1.1rem;
    }
    
    .toast {
        position: fixed;
        top: 30px;
        right: 30px;
        background: linear-gradient(45deg, #00f5ff, #ff00ff);
        color: #000;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(400px);
        animation: slideIn 0.3s ease-out forwards;
    }
    
    @keyframes slideIn {
        to { transform: translateX(0); }
    }
    
    .particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: #00f5ff;
        border-radius: 50%;
        animation: float 20s infinite linear;
    }
    
    .particle:nth-child(odd) {
        background: #ff00ff;
        width: 3px;
        height: 3px;
    }
    
    @keyframes float {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
    }
    
    @font-face {
        font-family: 'Orbitron';
        src: url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QRTechGenerator();
});
