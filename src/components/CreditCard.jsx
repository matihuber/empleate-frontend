import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de tarjeta de crédito 3D con efecto flip
 * Soporta diseños personalizados para Visa y Mastercard
 */
const CreditCard = ({
    cardNumber = '',
    cardHolder = '',
    expiryDate = '',
    cvv = '',
    isFlipped = false,
    cardType = 'visa' // 'visa' o 'mastercard'
}) => {
    // Formatear número de tarjeta con espacios (o placeholder)
    const formattedNumber = cardNumber
        ? cardNumber.match(/.{1,4}/g)?.join(' ') || cardNumber
        : '#### #### #### ####';

    // Formatear fecha de vencimiento (o placeholder)
    const formattedExpiry = expiryDate || 'MM/YY';

    // Formatear nombre (o placeholder)
    const formattedName = cardHolder || 'NOMBRE DEL TITULAR';

    // Formatear CVV (o placeholder)
    const formattedCVV = cvv || '***';

    // Colores según el tipo de tarjeta
    const cardColors = {
        visa: {
            background: 'linear-gradient(135deg, #1a1f71 0%, #0f1451 100%)',
            chip: 'opacity-90',
        },
        mastercard: {
            background: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
            chip: 'opacity-90',
        }
    };

    const currentColors = cardColors[cardType] || cardColors.visa;

    // SVG del chip EMV
    const ChipSVG = () => (
        <svg
            className={`absolute top-12 left-6 w-12 h-12 ${currentColors.chip}`}
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
        >
            <image
                id="image0"
                width="50"
                height="50"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOYfEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSWekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GSe0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOWekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bfu3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWuafUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrbtnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOhg0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU/f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dEorDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2NgGAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVgOkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3dI2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6alKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkIJVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0FqBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGmBSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCET amiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdCS24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAyLTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg=="
            />
        </svg>
    );

    // SVG del icono contactless
    const ContactlessSVG = () => (
        <svg
            className="absolute top-14 right-16 w-6 h-6 opacity-80"
            viewBox="0 0 50 50"
            xmlns="http://www.w3.org/2000/svg"
        >
            <image
                id="image0"
                width="50"
                height="50"
                x="0"
                y="0"
                href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IEzgIwaKTAAADDklEQVRYw+1XS0iUURQ+f5qPyjQflGRFEEFK76koKGxRbWyVVLSOgsCgwjZBJJYuKogSIoOonUK4q3U0WVBWFPZYiIE6kuArG3VGzK/FfPeMM/MLt99/NuHdfPd888/57jn3nvsQWWj/VcMlvMMd5KRTogqx9iCdIjUUmcGR9ImUYowyP3xNGQJoRLVaZ2DaZf8kyjEJALhI28ELioyiwC+Rc3QZwRYyO/DH51hQgWm6DMIh10KmD4u9O16K49itVoPOAmcGAWWOepXIRScAoJZ2Frro8oN+EyTT6lWkkg6msZfMSR35QTJmjU0g15tIGSJ08ZZMJkJkHpNZgSkyXosS13TkJpZ62mPIJvOSzC1bp8vRhhCakEk7G9/o4gmZdbpsTcKu0m63FbnBP9Qrc15zbkbemfgNDtEOI8NO5L5O9VYyRYgmJayZ9nPaxZrSjW4+F6Uw9yQqIiIZwhp2huQTf6OIvCZyGM6gDJBZbyXifJXr7FZjGXsdxADxI7HUJFB6iWvsIhFpkoiIiGTJfjJfiCuJg2ZEspq9EHGVpYgzKqwJqSAOEwuJQ/pxPvE3cYltJCLdxBLiSKKIE5HxJKcTRNeadxfhDiuYw44zVs1dxKwRk/uCxIiQkxKBsSctRVAge9g1E15EHE6yRUaJecRxcWlukdRIbGFOSZCMWQA/iWauIP3slREHXPyliqBcrrD71AmzZ+rD1Mt2Yr8TZc/UR4/YtFnbijnHi3UrN9vKQ9rPaJf867ZiaqDB+czeKYmd3pNa6fuI75MiC0uXXSR5aEMf7s7a6r/PudVXkjFb/SsrCRfROk0Fx6+H1i9kkTGn/E1vEmt1m089fh+RKdQ5O+xNJPUicUIjO0Dm7HwvErEr0YxeibL1StSh37STafE4I7zcBdRq1DiOkdmlTJVnkQTBTS7X1FYyvfO4piaInKbDCDaT2anLudYXCRFsQBgAcIF2/Okwgvz5+Z4tsw118dzruvIvjhTB+HOuWy8UvovEH6beitBKxDyxm9MmISKCWrzB7bSlaqGlsf0FC0gMjzTg6GgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDItMTNUMDg6MTk6NTYrMDA6MDCjlq7LAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTAyLTEzVDA4OjE5OjU2KzAwOjAw0ssWdwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wMi0xM1QwODoxOTo1NiswMDowMIXeN6gAAAAASUVORK5CYII="
            />
        </svg>
    );

    // Logo de Visa
    const VisaLogo = () => (
        <div className="absolute top-6 right-6">
            <svg className="w-16 h-auto" viewBox="0 0 48 16" fill="none">
                <text
                    x="0"
                    y="12"
                    className="font-bold"
                    style={{ fontSize: '14px', fill: '#1434CB', fontFamily: 'Arial, sans-serif' }}
                >
                    VISA
                </text>
            </svg>
        </div>
    );

    // Logo de Mastercard
    const MastercardLogo = () => (
        <div className="absolute top-6 right-6">
            <svg className="w-12 h-12" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="24" r="14" fill="#ff9800" />
                <circle cx="32" cy="24" r="14" fill="#d50000" />
                <path
                    fill="#ff3d00"
                    d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48C20.376,15.05,18,19.245,18,24z"
                />
            </svg>
        </div>
    );

    return (
        <div className="w-full max-w-sm mx-auto">
            <div
                className={`relative w-full aspect-[1.586/1] transition-transform duration-700 preserve-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Frente de la tarjeta */}
                <div
                    className="absolute inset-0 rounded-2xl shadow-2xl backface-hidden"
                    style={{
                        background: currentColors.background,
                        backfaceVisibility: 'hidden',
                    }}
                >
                    {/* Contenido del frente */}
                    <div className="relative w-full h-full p-6 text-white">
                        {/* Logo del tipo de tarjeta */}
                        {cardType === 'visa' ? <VisaLogo /> : <MastercardLogo />}

                        {/* Chip EMV */}
                        <ChipSVG />

                        {/* Icono contactless */}
                        <ContactlessSVG />

                        {/* Número de tarjeta */}
                        <div className="absolute bottom-20 left-6 right-6">
                            <p className="text-xl font-bold tracking-wider font-mono">
                                {formattedNumber}
                            </p>
                        </div>

                        {/* Nombre y fecha */}
                        <div className="absolute bottom-8 left-6 right-6 flex justify-between items-end">
                            <div className="flex-1">
                                <p className="text-xs text-gray-300 mb-1 uppercase">Titular</p>
                                <p className="text-sm font-semibold uppercase tracking-wide">
                                    {formattedName}
                                </p>
                            </div>
                            <div className="ml-4">
                                <p className="text-xs text-gray-300 mb-1 uppercase">Válido hasta</p>
                                <p className="text-sm font-semibold">{formattedExpiry}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reverso de la tarjeta */}
                <div
                    className="absolute inset-0 rounded-2xl shadow-2xl backface-hidden rotate-y-180"
                    style={{
                        background: currentColors.background,
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    {/* Contenido del reverso */}
                    <div className="relative w-full h-full">
                        {/* Banda magnética */}
                        <div className="absolute top-8 left-0 right-0 h-12 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800"></div>

                        {/* Firma y CVV */}
                        <div className="absolute top-24 left-6 right-6">
                            <div className="bg-white h-10 rounded flex items-center justify-between px-4">
                                <div className="flex-1 h-6 bg-gray-200 mr-2"></div>
                                <div className="text-black font-mono font-bold text-sm italic">
                                    {formattedCVV}
                                </div>
                            </div>
                        </div>

                        {/* Texto informativo */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-white text-xs opacity-70">
                                Esta tarjeta es propiedad del banco emisor. Si la encuentra, por favor devuélvala al banco más cercano.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estilos globales necesarios para el efecto 3D */}
            <style jsx>{`
                .preserve-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
};

CreditCard.propTypes = {
    cardNumber: PropTypes.string,
    cardHolder: PropTypes.string,
    expiryDate: PropTypes.string,
    cvv: PropTypes.string,
    isFlipped: PropTypes.bool,
    cardType: PropTypes.oneOf(['visa', 'mastercard']),
};

export default CreditCard;
