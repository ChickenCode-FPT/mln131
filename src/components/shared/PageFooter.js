import * as HiIcons from 'react-icons/hi2';
import '../Footer.css';

export default function PageFooter() {
    return (
        <footer className="page-footer">
            <div className="footer-content">
                <div className="footer-column">
                    <div className="footer-head">
                        <HiIcons.HiOutlineBookOpen className="footer-icon" />
                        <h4 className="footer-title">Dự án học thuật</h4>
                    </div>
                    <p className="footer-text"><span className="footer-label">Môn: </span>MLN131</p>
                    <p className="footer-text"><span className="footer-label">Trường: </span>Đại học FPT</p>
                    <p className="footer-text"><span className="footer-label">Học kỳ: </span>2025</p>
                    <div className="footer-accent accent-red" />
                </div>

                <div className="footer-column">
                    <div className="footer-head">
                        <HiIcons.HiUserGroup className="footer-icon" />
                        <h4 className="footer-title">Thông tin nhóm</h4>
                    </div>
                    <p className="footer-text"><span className="footer-label">Nhóm:</span>6</p>
                    <p className="footer-text"><span className="footer-label">Thành viên:</span></p>
                    <ul className="footer-list">
                        <li>Đỗ Quốc Hưng - SE170515</li>
                        <li>Vũ Quang Nguyên - SE180208</li>
                        <li>Lê Tiến Đạt - SE182453</li>
                        <li>Hồ Tài Liên Vy Kha - SE182749</li>
                        <li>Phạm Thế Danh - SE184514</li>
                        <li>Trần Thiện Duy - SE184596</li>
                    </ul>
                    <div className="footer-accent accent-purple" />
                </div>

                <div className="footer-column">
                    <div className="footer-head">
                        <HiIcons.HiEnvelope className="footer-icon" />
                        <h4 className="footer-title">Giảng viên</h4>
                    </div>
                    <p className="footer-text"><span className="footer-label">Hướng dẫn:</span>Lê Minh Trí</p>
                    <p className="footer-text footer-note">Cảm ơn thầy đã hỗ trợ nhóm trong quá trình thực hiện dự án.</p>
                    <div className="footer-accent accent-green" />
                </div>
            </div>
            <div className="footer-bottom">
                <p className="footer-copyright">© 2025 - Sản phẩm học tập nhóm 6 - FPT University</p>
                <p className="footer-made">Made with <HiIcons.HiHeart className="inline-icon" /> in Vietnam</p>
            </div>
        </footer>
    );
}
