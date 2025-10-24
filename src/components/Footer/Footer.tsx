// src/components/Footer/Footer.tsx
import React, { useState } from 'react';

const FuturitySystemsLogo: React.FC = () => (
  <svg
    width='187'
    height='81'
    viewBox='0 0 187 81'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M77.7732 17.5624H75.1211V13.8918H77.7732V11.4578C77.7732 7.9393 79.2705 5.21577 83.4835 5.21577C84.193 5.21577 85.0199 5.32863 85.4652 5.46113V9.21518C85.0836 9.12685 84.6481 9.06306 84.1881 9.06306C82.6419 9.06306 82.1868 9.9709 82.1868 11.7228V13.8967H85.4065V17.5673H82.1868V35.842H77.7732V17.5624Z'
      fill='white'
    />
    <path
      d='M102.431 29.5399C102.431 32.5873 102.431 34.7366 102.475 35.8408H98.2666C98.1541 35.1832 98.11 34.2361 98.0807 33.2694C97.1755 35.3402 95.5118 36.2285 93.0995 36.2285C90.1782 36.2285 87.6289 34.8593 87.6289 29.6576V13.8955H92.0572V28.6467C92.0572 31.0268 92.6199 32.4057 94.68 32.4057C96.74 32.4057 98.0122 31.223 98.0122 27.3169V13.8955H102.44V29.5448L102.431 29.5399Z'
      fill='white'
    />
    <path
      d='M105.152 13.8902H108.093V8.28613H112.497V13.8902H116.02V17.5609H112.497V30.3737C112.497 31.7281 112.761 32.5231 114.361 32.5231C114.87 32.5231 115.291 32.5084 115.707 32.425V35.7177C114.841 36.0809 113.559 36.1348 112.791 36.1348C109.605 36.1348 108.098 34.9227 108.098 31.1442V17.5609H105.157V13.8902H105.152Z'
      fill='white'
    />
    <path
      d='M133.419 29.5399C133.419 32.5873 133.419 34.7366 133.463 35.8408H129.255C129.137 35.1832 129.098 34.2361 129.069 33.2694C128.164 35.3402 126.5 36.2285 124.088 36.2285C121.167 36.2285 118.617 34.8593 118.617 29.6576V13.8955H123.046V28.6467C123.046 31.0268 123.608 32.4057 125.668 32.4057C127.728 32.4057 129 31.223 129 27.3169V13.8955H133.429V29.5448L133.419 29.5399Z'
      fill='white'
    />
    <path
      d='M137.655 21.3465C137.655 17.774 137.655 15.4627 137.611 13.8973H141.834C141.878 14.3389 141.947 15.2909 141.947 17.6121C142.808 15.0701 144.799 13.5538 147.696 13.5391V18.4856C144.056 18.4709 142.064 19.9676 142.064 24.0799V35.8475H137.65V21.3514L137.655 21.3465Z'
      fill='white'
    />
    <path
      d='M150.469 13.8905H154.882V35.8358H150.469V13.8905ZM150.498 5.48438H154.912V10.3328H150.498V5.48438Z'
      fill='white'
    />
    <path
      d='M157.555 13.8902H160.495V8.28613H164.899V13.8902H168.422V17.5609H164.899V30.3737C164.899 31.7281 165.164 32.5231 166.764 32.5231C167.273 32.5231 167.693 32.5084 168.109 32.425V35.7177C167.243 36.0809 165.961 36.1348 165.193 36.1348C162.007 36.1348 160.5 34.9227 160.5 31.1442V17.5609H157.56V13.8902H157.555Z'
      fill='white'
    />
    <path
      d='M174.954 13.8916C176.808 21.6647 178.438 27.8528 178.707 30.3947H178.751C179.225 27.4749 180.855 20.6931 182.533 13.8916H187.001L180.669 36.8723C178.829 43.5658 176.637 44.1204 173.569 44.1204C173.035 44.1204 172.272 44.0762 171.739 43.9633V40.1749C172.037 40.2289 172.771 40.2731 173.265 40.2731C175.316 40.2731 175.971 39.1002 176.647 36.1804L170.129 13.8867H174.954V13.8916Z'
      fill='white'
    />
    <path
      d='M78.601 60.6332C78.6597 62.233 79.472 63.764 81.4635 63.764C83.181 63.764 84.003 62.7973 84.003 61.3349C84.003 59.7254 83.2397 58.9059 80.8323 57.9931C76.3942 56.3344 75.2345 54.7641 75.2345 51.9425C75.2345 49.2778 76.8982 46.4414 81.3558 46.4414C86.2539 46.4414 87.5017 49.8029 87.5115 52.3988H83.6997C83.6752 51.6235 83.5578 49.5232 81.2531 49.5232C79.8292 49.5232 79.1148 50.4212 79.1148 51.6676C79.1148 53.027 79.8194 53.6649 82.2953 54.6022C86.3224 56.1136 87.9371 57.6398 87.9371 60.8884C87.9371 64.667 85.5786 66.8507 81.2971 66.8507C77.0156 66.8507 74.755 64.1664 74.7109 60.643H78.6059L78.601 60.6332Z'
      fill='white'
    />
    <path
      d='M93.4105 46.7949C95.0742 53.7681 96.5373 59.3281 96.777 61.6099H96.8162C97.2419 58.9895 98.7049 52.9045 100.212 46.7949H104.22L98.5386 67.4201C96.8896 73.4315 94.9176 73.9272 92.1677 73.9272C91.6881 73.9272 91.0031 73.8879 90.5236 73.7849V70.389C90.7927 70.4381 91.4484 70.4774 91.8936 70.4774C93.7335 70.4774 94.3255 69.4223 94.9323 66.8067L89.0801 46.7949H93.4105Z'
      fill='white'
    />
    <path
      d='M109.207 60.6332C109.266 62.233 110.078 63.764 112.07 63.764C113.787 63.764 114.609 62.7973 114.609 61.3349C114.609 59.7254 113.846 58.9059 111.439 57.9931C107.001 56.3344 105.841 54.7641 105.841 51.9425C105.841 49.2778 107.505 46.4414 111.962 46.4414C116.86 46.4414 118.108 49.8029 118.123 52.3988H114.311C114.287 51.6235 114.169 49.5232 111.864 49.5232C110.441 49.5232 109.726 50.4212 109.726 51.6676C109.726 53.027 110.431 53.6649 112.907 54.6022C116.934 56.1136 118.548 57.6398 118.548 60.8884C118.548 64.667 116.19 66.8507 111.908 66.8507C107.627 66.8507 105.366 64.1664 105.322 60.643H109.217L109.207 60.6332Z'
      fill='white'
    />
    <path
      d='M119.668 46.7946H122.31V41.7646H126.259V46.7946H129.42V50.0874H126.259V61.59C126.259 62.8021 126.494 63.5234 127.933 63.5234C128.392 63.5234 128.769 63.5136 129.141 63.4351V66.3893C128.363 66.7132 127.213 66.7672 126.523 66.7672C123.666 66.7672 122.31 65.6777 122.31 62.2868V50.0972H119.668V46.7946Z'
      fill='white'
    />
    <path
      d='M134.877 57.6092C134.877 60.5634 135.303 63.547 138.019 63.547C140.554 63.547 140.881 61.2848 140.969 60.6419H144.781C144.718 61.2259 144.238 66.8692 137.965 66.8692C131.692 66.8692 130.934 61.5203 130.934 56.564C130.934 50.322 133.219 46.4648 138.078 46.4648C143.597 46.4648 144.933 50.7391 144.933 55.8034C144.933 56.3873 144.908 57.2216 144.869 57.6092H134.877ZM141.009 54.6747C141.009 52.2652 140.622 49.7576 138.058 49.7576C135.127 49.7576 134.961 53.2761 134.936 54.6747H141.009Z'
      fill='white'
    />
    <path
      d='M148.188 52.7069C148.188 48.9479 148.188 47.6769 148.148 46.7985H151.941C152.019 47.2451 152.073 48.256 152.073 48.9774C152.919 47.3923 154.353 46.4648 156.418 46.4648C158.483 46.4648 159.828 47.4021 160.43 49.2227C161.203 47.78 162.622 46.4648 165.23 46.4648C167.839 46.4648 170.129 47.8094 170.129 52.3094V66.4963H166.219V52.9228C166.219 51.2102 165.69 49.8754 163.904 49.8754C161.844 49.8754 161.159 51.5488 161.159 54.0564V66.4963H157.225V53.0013C157.225 50.9844 156.55 49.9048 154.935 49.9048C152.944 49.9048 152.127 51.4604 152.127 54.2232V66.4963H148.192V52.7069H148.188Z'
      fill='white'
    />
    <path
      d='M176.913 60.6332C176.972 62.233 177.784 63.764 179.776 63.764C181.493 63.764 182.316 62.7973 182.316 61.3349C182.316 59.7254 181.552 58.9059 179.145 57.9931C174.707 56.3344 173.547 54.7641 173.547 51.9425C173.547 49.2778 175.211 46.4414 179.668 46.4414C184.566 46.4414 185.814 49.8029 185.824 52.3988H182.012C181.988 51.6235 181.87 49.5232 179.566 49.5232C178.142 49.5232 177.427 50.4212 177.427 51.6676C177.427 53.027 178.132 53.6649 180.608 54.6022C184.635 56.1136 186.25 57.6398 186.25 60.8884C186.25 64.667 183.891 66.8507 179.61 66.8507C175.328 66.8507 173.067 64.1664 173.023 60.643H176.918L176.913 60.6332Z'
      fill='white'
    />
    <path
      d='M15.8685 28.8974L34.3739 19.702L34.3685 0.21582L0.0332031 19.7363L15.8685 28.8974Z'
      fill='white'
    />
    <path d='M0 36.7808L15.1192 29.2689L0 20.521V36.7808Z' fill='white' />
    <path
      d='M16.8375 50.3575C16.8375 50.233 16.904 50.1175 17.012 50.0561C17.1199 49.9948 17.2513 49.9948 17.3592 50.0561L34.373 59.9156V40.4096L0 20.521V60.3162L16.8375 70.0638V50.3557V50.3575Z'
      fill='white'
    />
    <path
      d='M35.0679 60.719L35.0625 80.2142L69.4409 60.3166V40.6445L35.0679 60.719Z'
      fill='white'
    />
    <path
      d='M34.3723 60.7189L17.5312 50.9604V70.4665L34.3669 80.2159L34.3723 60.7189Z'
      fill='white'
    />
    <path
      d='M51.9072 29.4748L51.8982 9.96879L35.0625 0.221191L35.0679 19.7164L51.9072 29.4748Z'
      fill='white'
    />
    <path
      d='M52.6021 30.0796C52.6021 30.2041 52.5356 30.3196 52.4276 30.3809C52.3736 30.4116 52.3143 30.4278 52.2549 30.4278C52.1955 30.4278 52.1343 30.4116 52.0804 30.3809L35.0684 20.5214V40.0275L52.1721 49.923L69.4396 39.8362V20.1172L52.5913 10.3696L52.6003 30.0778L52.6021 30.0796Z'
      fill='white'
    />
  </svg>
);

const Footer: React.FC = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  return (
    <>
      <footer
        style={{
          position: 'relative',
          width: '100%',
          background: '#111111',
          padding: '32px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: '1480px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          {/* Top section */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '32px',
              paddingBottom: '32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <FuturitySystemsLogo />
              <p
                style={{
                  color: '#A7ACB2',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  maxWidth: '400px',
                }}
              >
                Pioneering scientific solutions and innovation for Fortune 500
                companies and governmental agencies worldwide.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <h3
                style={{
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                Explore
              </h3>
              <a
                href='/search'
                style={{
                  color: '#A7ACB2',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8285FF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#A7ACB2')}
              >
                Browse All Cards
              </a>
              <a
                href='/deck/ag'
                style={{
                  color: '#A7ACB2',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8285FF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#A7ACB2')}
              >
                Agriculture Deck
              </a>
              <a
                href='/deck/ac'
                style={{
                  color: '#A7ACB2',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8285FF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#A7ACB2')}
              >
                Advanced Computing Deck
              </a>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <h3
                style={{
                  color: '#FFFFFF',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                About
              </h3>
              <a
                href='https://futurity.science'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  color: '#A7ACB2',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8285FF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#A7ACB2')}
              >
                Futurity Science
              </a>
              <a
                href='https://futurity.systems'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  color: '#A7ACB2',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8285FF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#A7ACB2')}
              >
                Futurity Systems
              </a>
            </div>
          </div>

          {/* Bottom section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <button
                onClick={() => setShowPrivacyPolicy(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A7ACB2',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8285FF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#A7ACB2')}
              >
                Privacy Policy
              </button>
            </div>
            <p
              style={{
                color: '#646E78',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              © MarsBound S.L. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal - same as before */}
      {showPrivacyPolicy && (
        <div
          onClick={() => setShowPrivacyPolicy(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#1a1a1a',
              borderRadius: '12px',
              maxWidth: '800px',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Modal content same as before... */}
            <div
              style={{
                padding: '24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                }}
              >
                Privacy Policy
              </h2>
              <button
                onClick={() => setShowPrivacyPolicy(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: '24px',
                overflowY: 'auto',
                color: '#FFFFFF',
                lineHeight: '1.6',
              }}
            >
              <p
                style={{
                  color: '#646E78',
                  fontSize: '14px',
                  marginBottom: '24px',
                }}
              >
                Last updated: 5/28/2025
              </p>
              <p>
                For full privacy policy details, please contact us at
                fast@futurity.science
              </p>
            </div>

            <div
              style={{
                padding: '16px 24px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowPrivacyPolicy(false)}
                style={{
                  background: 'none',
                  border: '1px solid #FFFFFF',
                  color: '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.color = '#111111';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
