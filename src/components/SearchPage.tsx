import React, { useState, useEffect } from 'react';
import { getPetInfo } from '../services/PetService.ts';
import { translations } from '../localization/translations.ts';
import Spinner from 'react-spinkit';  // Optional: You can use any spinner component
import './SearchPage.scss';

const SearchPage: React.FC = () => {
    const [petCode, setPetCode] = useState<string>('');
    const [scannedCode, setScannedCode] = useState<string | null>(null);
    const [petInfo, setPetInfo] = useState<any>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'nl'>('en');
    const [currentTranslations, setCurrentTranslations] = useState(translations.en);
    const [loading, setLoading] = useState<boolean>(false); // State for loading
    const isNative = false; // Set this based on your platform check
    const [isTouched, setIsTouched] = useState<boolean>(false); // Track if input is touched

    const fetchPetInfo = async () => {
        const code = petCode.trim();
        console.log('Fetching pet info for code:', code);
        setMessage(null);
        setLoading(true); // Start loading

        try {
            const info = await getPetInfo(code);
            setPetInfo(info);
            setMessage(null);
            console.log('Fetched pet info:', info);
        } catch (error: any) {
            console.error('Error fetching pet info:', error);
            handleFetchError(error);
            setPetInfo(null);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleFetchError = (error: any) => {
        if (error.response) {
            const status = error.response.status;
            setMessage(error.response.data?.message || getDefaultErrorMessage(status));
        } else {
            setMessage('An error occurred while fetching pet info.');
        }
    };

    const getDefaultErrorMessage = (status: number) => {
        switch (status) {
            case 400: return 'Bad Request.';
            case 403: return 'Access denied.';
            case 404: return 'Pet not found.';
            case 500: return 'Server error occurred.';
            default: return 'An error occurred while fetching pet info.';
        }
    };

    const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = event.target.value as 'en' | 'nl';
        setSelectedLanguage(lang);
        setCurrentTranslations(translations[lang]);
    };

    const getPetInfoTitle = () => {
        if (!petInfo || !petInfo.zoekresultaat?.Diersoort) {
            return currentTranslations.petInfoTitle; // Default title
        }
        const breed = petInfo.zoekresultaat.Diersoort.toLowerCase();
        return breed === 'kat' ? currentTranslations.catInfoTitle : currentTranslations.petInfoTitle;
    };

    const openScanner = () => {
        // Implement QR scanner logic here
        // On successful scan, set the scannedCode
        // setScannedCode(scannedCodeFromScanner);
    };

    return (
        <div className="pet-finder-container">
            <div className="disclaimer" style={{ display: isNative ? 'none' : 'block' }}>
                <h3><strong>Disclaimer</strong></h3>
                <p>{currentTranslations.disclaimer} <a href="https://www.linkedin.com/in/artur-pukhavoi-7b104b302" target="_blank" rel="noopener noreferrer">Artur Pukhavoi.</a></p>
                <br />
                <p>{currentTranslations.disclaimerDetails}</p>
                <br />
                <p>{currentTranslations.discGit} <a href="https://github.com/arturPukhavy/PetFinder-FE" target="_blank" rel="noopener noreferrer">GitHub Repository</a></p>
            </div>

            <div className="language-selector">
                <label htmlFor="language-select" className="language-label">🌐:</label>
                <select id="language-select" value={selectedLanguage} onChange={changeLanguage}>
                    <option value="en">EN</option>
                    <option value="nl">NL</option>
                </select>
            </div>

            <h1 className="title">{currentTranslations.title}</h1>

            {/* Input Section */}
            <div className="input-section">
                <div className="input-wrapper">
                    <input
                        id="pet-code-input"
                        type="text"
                        value={petCode}
                        placeholder={currentTranslations.searchPlaceholder}
                        onChange={(e) => { 
                            setPetCode(e.target.value);
                            setIsTouched(true); // Mark as touched on change
                        }}
                        onKeyUp={(e) => e.key === 'Enter' && fetchPetInfo()}
                        minLength={15}
                        maxLength={15}
                        pattern="^[0-9]*"
                    />
                    <button
                        onClick={fetchPetInfo}
                        className="primary-button"
                        disabled={petCode.length !== 15}
                    >
                        {currentTranslations.searchButton}
                    </button>
                </div>
                <div className="validation-message">
                    {isTouched && petCode.length < 15 && <small>{currentTranslations.errorMin}</small>}
                    {isTouched && petCode.match(/^[0-9]*$/) === null && <small>{currentTranslations.errorNumbers}</small>}
                </div>
            </div>

            <div className="qr-section">
                <button
                    className="secondary-button"
                    disabled={!isNative}
                    onClick={isNative ? openScanner : undefined}
                >
                    {currentTranslations.scanButton}
                </button>
                {scannedCode && (
                    <div className="scanned-code-section">
                        <h2>Scanned Pet Code: <span>{scannedCode}</span></h2>
                        <button onClick={fetchPetInfo} className="primary-button">{currentTranslations.searchButton}</button>
                    </div>
                )}
            </div>

            {/* Spinner */}
            {loading ? (
              <Spinner name="ball-scale-multiple" fadeIn="none" />
            //   <p>{currentTranslations.spinner}...</p>
            ) : null}

            {/* Pet Info Section */}
            {petInfo && (
                <div className="pet-info">
                    <h2>{getPetInfoTitle()}</h2>
                    <table className="pet-info-table">
                        <tbody>
                            <tr>
                                <td>{currentTranslations.idNumber}</td>
                                <td>{petInfo.zoekresultaat.Identificatienummer}</td>
                            </tr>
                            <tr>
                                <td>{currentTranslations.name}</td>
                                <td>{petInfo.zoekresultaat.Diernaam}</td>
                            </tr>
                            <tr>
                                <td>{currentTranslations.breed}</td>
                                <td>{petInfo.zoekresultaat.Diersoort}</td>
                            </tr>
                            <tr>
                                <td>{currentTranslations.passportRegistered}</td>
                                <td>{petInfo.zoekresultaat.Paspoort_geregistreerd}</td>
                            </tr>
                            <tr>
                                <td>{currentTranslations.city}</td>
                                <td>{petInfo.zoekresultaat.Woonplaats_houder}</td>
                            </tr>
                            <tr>
                                <td>{currentTranslations.country}</td>
                                <td>{petInfo.zoekresultaat.Land_houder}</td>
                            </tr>
                            <tr>
                                <td>{currentTranslations.phoneNL}</td>
                                <td>{petInfo.zoekresultaat.Telefoon_Nederland}</td>
                            </tr>
                            <tr>
                                <td>{currentTranslations.phoneOutside}</td>
                                <td>{petInfo.zoekresultaat.Telefoon_buitenland}</td>
                            </tr>
                            <tr>
                                <td>{currentTranslations.missing}</td>
                                <td>{petInfo.zoekresultaat.Vermist}</td>
                            </tr>
                            <tr>
                                <td>{currentTranslations.dead}</td>
                                <td>{petInfo.zoekresultaat.Overleden}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {message && <div className="message"><p>{message}</p></div>}
        </div>
    );
};

export default SearchPage;