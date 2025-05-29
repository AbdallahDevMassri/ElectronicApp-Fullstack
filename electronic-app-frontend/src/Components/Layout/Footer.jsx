const Footer = () => {
  return (
    <footer className="footer">
      <a
        className="footer-signature"
        href="https://github.com/AbdallahDevMassri"
        target="_blank"
        rel="noopener noreferrer"
      >
        Abdallah Massri
      </a>
      <p>© {new Date().getFullYear()} ElectronicApp. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
