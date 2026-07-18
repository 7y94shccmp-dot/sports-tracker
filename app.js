// Live Sports Tracker App
class SportsTracker {
    constructor() {
        this.currentSport = 'all';
        this.currentStatus = 'all';
        this.searchQuery = '';
        this.games = [];
        this.updateInterval = null;
        this.init();
    }

    init() {
        this.setupBackgroundAnimation();
        this.attachEventListeners();
        this.loadGames();
        this.startAutoRefresh();
        this.initPageNavigation();
    }

    setupBackgroundAnimation() {
        const canvas = document.getElementById('backgroundCanvas');
        if (!canvas) return;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);
        gradient.addColorStop(0, '#1e3a8a');
        gradient.addColorStop(0.5, '#0f172a');
        gradient.addColorStop(1, '#1e3a8a');
        
        // Animate background
        let offset = 0;
        const animate = () => {
            // Fill with gradient
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add animated particles
            ctx.fillStyle = 'rgba(14, 165, 233, 0.1)';
            for (let i = 0; i < 5; i++) {
                const x = (Math.sin(offset / 100 + i) * canvas.width / 2) + canvas.width / 2;
                const y = (Math.cos(offset / 150 + i * 2) * canvas.height / 2) + canvas.height / 2;
                ctx.beginPath();
                ctx.arc(x, y, 50, 0, Math.PI * 2);
                ctx.fill();
            }
            
            offset += 0.5;
            requestAnimationFrame(animate);
        };
        animate();
        
        // Resize canvas on window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    initPageNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const page = e.target.dataset.page;
                
                // Update active nav
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update active page
                document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
                document.getElementById(page + 'Page').classList.add('active');
            });
        });
    }

    attachEventListeners() {
        // Sport buttons
        document.querySelectorAll('.sport-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.sport-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentSport = e.target.dataset.sport;
                this.renderGames();
            });
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderGames();
        });

        // Status filter
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.currentStatus = e.target.value;
            this.renderGames();
        });

        // Mouse follower
        this.setupMouseFollower();
    }

    setupMouseFollower() {
        const follower = document.getElementById('mouseFollower');
        follower.classList.add('active');
        
        document.addEventListener('mousemove', (e) => {
            follower.style.left = (e.clientX - 50) + 'px';
            follower.style.top = (e.clientY - 50) + 'px';
        });
    }

    startAutoRefresh() {
        // Refresh every 30 seconds
        this.updateInterval = setInterval(() => {
            this.loadGames();
        }, 30000);
    }

    async loadGames() {
        try {
            // For demo purposes, we'll generate mock data
            // In production, replace with actual API calls
            this.games = this.generateMockGames();
            this.renderGames();
            this.updateStats();
        } catch (error) {
            console.error('Error loading games:', error);
            this.showNotification('Error loading games', 'warning');
        }
    }

    updateStats() {
        const liveGames = this.games.filter(g => g.status === 'live').length;
        const upcomingGames = this.games.filter(g => g.status === 'upcoming').length;
        
        document.getElementById('liveGamesCount').textContent = liveGames;
        document.getElementById('totalGamesCount').textContent = this.games.length;
        document.getElementById('upcomingGamesCount').textContent = upcomingGames;
    }

    generateMockGames() {
        const sports = ['nfl', 'nba', 'mlb', 'soccer', 'nhl'];
        const teams = {
            nfl: [
                { name: 'Kansas City Chiefs', abbr: 'KC' },
                { name: 'San Francisco 49ers', abbr: 'SF' },
                { name: 'Buffalo Bills', abbr: 'BUF' },
                { name: 'Dallas Cowboys', abbr: 'DAL' },
                { name: 'New England Patriots', abbr: 'NE' },
                { name: 'Philadelphia Eagles', abbr: 'PHI' },
            ],
            nba: [
                { name: 'Los Angeles Lakers', abbr: 'LAL' },
                { name: 'Boston Celtics', abbr: 'BOS' },
                { name: 'Golden State Warriors', abbr: 'GSW' },
                { name: 'Denver Nuggets', abbr: 'DEN' },
                { name: 'Miami Heat', abbr: 'MIA' },
                { name: 'Los Angeles Clippers', abbr: 'LAC' },
            ],
            mlb: [
                { name: 'New York Yankees', abbr: 'NYY' },
                { name: 'Boston Red Sox', abbr: 'BOS' },
                { name: 'Los Angeles Dodgers', abbr: 'LAD' },
                { name: 'Houston Astros', abbr: 'HOU' },
                { name: 'New York Mets', abbr: 'NYM' },
                { name: 'Chicago Cubs', abbr: 'CHC' },
            ],
            soccer: [
                { name: 'Manchester United', abbr: 'MUN' },
                { name: 'Liverpool', abbr: 'LIV' },
                { name: 'Real Madrid', abbr: 'RMA' },
                { name: 'Barcelona', abbr: 'BAR' },
                { name: 'Manchester City', abbr: 'MCY' },
                { name: 'Chelsea', abbr: 'CHE' },
            ],
            nhl: [
                { name: 'New York Rangers', abbr: 'NYR' },
                { name: 'Toronto Maple Leafs', abbr: 'TOR' },
                { name: 'Las Vegas Golden Knights', abbr: 'VGK' },
                { name: 'Colorado Avalanche', abbr: 'COL' },
                { name: 'Boston Bruins', abbr: 'BOS' },
                { name: 'Edmonton Oilers', abbr: 'EDM' },
            ],
        };

        const statuses = ['live', 'upcoming', 'completed'];
        const games = [];

        sports.forEach(sport => {
            for (let i = 0; i < 3; i++) {
                const teamPool = teams[sport];
                const team1 = teamPool[Math.floor(Math.random() * teamPool.length)];
                const team2 = teamPool.find(t => t.name !== team1.name) || teamPool[0];
                
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                const now = new Date();
                
                let gameTime;
                if (status === 'upcoming') {
                    gameTime = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
                } else {
                    gameTime = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
                }

                const score1 = Math.floor(Math.random() * 150);
                const score2 = Math.floor(Math.random() * 150);

                games.push({
                    id: `${sport}-${i}-${Date.now()}`,
                    sport,
                    status,
                    league: sport.toUpperCase(),
                    time: gameTime,
                    team1: {
                        name: team1.name,
                        abbr: team1.abbr,
                        score: status === 'upcoming' ? null : score1,
                        record: `${Math.floor(Math.random() * 20)}-${Math.floor(Math.random() * 20)}`,
                    },
                    team2: {
                        name: team2.name,
                        abbr: team2.abbr,
                        score: status === 'upcoming' ? null : score2,
                        record: `${Math.floor(Math.random() * 20)}-${Math.floor(Math.random() * 20)}`,
                    },
                    stats: {
                        possessionTime: `${Math.floor(Math.random() * 40)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
                        shots: `${Math.floor(Math.random() * 30)}`,
                        fouls: `${Math.floor(Math.random() * 20)}`,
                    },
                    period: status === 'live' ? Math.floor(Math.random() * 4) + 1 : null,
                    timeRemaining: status === 'live' ? `${Math.floor(Math.random() * 12)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : null,
                });
            }
        });

        return games;
    }

    filterGames() {
        return this.games.filter(game => {
            // Filter by sport
            if (this.currentSport !== 'all' && game.sport !== this.currentSport) {
                return false;
            }

            // Filter by status
            if (this.currentStatus !== 'all' && game.status !== this.currentStatus) {
                return false;
            }

            // Filter by search query
            if (this.searchQuery) {
                const query = this.searchQuery;
                return (
                    game.team1.name.toLowerCase().includes(query) ||
                    game.team2.name.toLowerCase().includes(query) ||
                    game.team1.abbr.toLowerCase().includes(query) ||
                    game.team2.abbr.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }

    renderGames() {
        const container = document.getElementById('gamesContainer');
        const filteredGames = this.filterGames();

        if (filteredGames.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h2>No games found</h2>
                    <p>Try adjusting your filters or check back later</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredGames.map(game => this.createGameCard(game)).join('');
    }

    createGameCard(game) {
        const isLive = game.status === 'live';
        const isCompleted = game.status === 'completed';
        const winner = isCompleted ? this.getWinner(game) : null;

        const timeString = game.time.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        const statusBadgeClass = game.status === 'live' ? 'live' : game.status === 'upcoming' ? 'upcoming' : 'completed';
        const statusText = game.status.charAt(0).toUpperCase() + game.status.slice(1);

        return `
            <div class="game-card ${isLive ? 'live' : ''}">
                <div class="status-badge ${statusBadgeClass}">
                    ${isLive ? '<span class="live-indicator"><span class="live-dot"></span>LIVE</span>' : statusText}
                </div>

                <div class="game-header">
                    <div class="game-time">${timeString}</div>
                    <div class="game-league">${game.league}</div>
                </div>

                <div class="teams-section">
                    <div class="team ${winner === 1 ? 'winner' : ''}">
                        <div class="team-info">
                            <div class="team-name">${game.team1.name}</div>
                            <div class="team-record">${game.team1.record}</div>
                        </div>
                        <div class="team-score">${game.team1.score !== null ? game.team1.score : '-'}</div>
                    </div>

                    <div class="team ${winner === 2 ? 'winner' : ''}">
                        <div class="team-info">
                            <div class="team-name">${game.team2.name}</div>
                            <div class="team-record">${game.team2.record}</div>
                        </div>
                        <div class="team-score">${game.team2.score !== null ? game.team2.score : '-'}</div>
                    </div>
                </div>

                ${isLive ? `
                    <div class="game-stats">
                        <div class="stat-row">
                            <span class="stat-label">Period:</span>
                            <span class="stat-value">${game.period} / 4</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Time:</span>
                            <span class="stat-value">${game.timeRemaining}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Possession:</span>
                            <span class="stat-value">${game.stats.possessionTime}</span>
                        </div>
                        <div class="stat-row">
                            <span class="stat-label">Shots:</span>
                            <span class="stat-value">${game.stats.shots}</span>
                        </div>
                    </div>
                ` : ''}

                ${isCompleted ? `
                    <div class="game-stats">
                        <div class="stat-row">
                            <span class="stat-label">Final Score</span>
                            <span class="stat-value">Game Finished</span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    getWinner(game) {
        if (game.team1.score > game.team2.score) return 1;
        if (game.team2.score > game.team1.score) return 2;
        return null;
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        container.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sportsTracker = new SportsTracker();
});
