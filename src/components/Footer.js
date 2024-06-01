import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faYoutube,
  faInstagram,
  faTwitter,
  faEnvelope,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope as solidEnvelope,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";

const FooterContainer = styled.footer`
  background: #f2f2f2;
  padding: 10px;
  text-align: center;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #888;
`;

const IconContainer = styled.div`
  margin-top: 10px;
`;

const IconLink = styled.a`
  color: #888;
  margin-right: 10px;
  &:hover {
    color: #000;
  }
`;

const Footer = () => {
  // Your app's content and components

  const currentYear = new Date().getFullYear();

  return (
    <div>
      {/* Your app's content */}
      <FooterContainer>
        <FooterText>
          Copyright © {currentYear} Here for the Hereafter.
          <br />A 501(c)(3) nonprofit organization dedicated to spreading
          Islamic education.
        </FooterText>
        <IconContainer>
          <IconLink href="https://www.hereforthehereafter.com">
            <FontAwesomeIcon icon={faGlobe} size="3x" />
          </IconLink>

          <IconLink href="https://www.facebook.com/hereforthehereafter">
            <FontAwesomeIcon icon={faFacebook} size="3x" />
          </IconLink>
          <IconLink href="https://www.youtube.com/hereforthehereafter">
            <FontAwesomeIcon icon={faYoutube} size="3x" />
          </IconLink>
          <IconLink href="https://www.instagram.com/hereforthehereafter">
            <FontAwesomeIcon icon={faInstagram} size="3x" />
          </IconLink>
          <IconLink href="https://www.twitter.com/herehereafter">
            <FontAwesomeIcon icon={faTwitter} size="3x" />
          </IconLink>
          <IconLink href="mailto:hereforthehereafter@gmail.com">
            <FontAwesomeIcon icon={solidEnvelope} size="3x" />
          </IconLink>
        </IconContainer>
      </FooterContainer>
    </div>
  );
};

export default Footer;
