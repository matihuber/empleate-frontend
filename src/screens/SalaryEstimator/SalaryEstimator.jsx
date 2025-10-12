import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { salaryEstimationService } from '../../services/salaryEstimationService';
import { useSubscriptionRestrictions } from '../../hooks/useSubscriptionRestrictions';
import SubscriptionRestrictionModal from '../../components/SubscriptionRestrictionModal';
import './SalaryEstimator.css';

const SalaryEstimator = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    rubro: '',
    posicion: '',
    region: '',
    seniority: ''
  });
  
  const [options, setOptions] = useState({
    rubros: [],
    posiciones: [],
    regiones: [],
    seniorities: []
  });

  const [customPosition, setCustomPosition] = useState('');
  const [showCustomPosition, setShowCustomPosition] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Hook para restricciones de suscripción
  const {
    executeWithSubscriptionCheck,
    isRestrictionModalOpen,
    restrictedFeature,
    closeRestrictionModal
  } = useSubscriptionRestrictions();

  // Cargar opciones del dataset
  useEffect(() => {
    loadOptions();
  }, []);

  // Mapeo de posiciones por rubro basado en el análisis del CSV
  const positionsByRubro = {
    'Tecnología': [
      'Developer',
      'Software Engineer',
      'Cloud Engineer',
      'SysAdmin / DevOps / SRE',
      'Technical Leader',
      'BI Analyst / Data Analyst',
      'QA / Tester',
      'Data Engineer',
      'Data Scientist',
      'Architect',
      'UX Designer',
      'Infosec',
      'Scrum Master',
      'DBA (Database Administrator)',
      'Technical Support',
      'Manager',
      'Director',
      'CTO',
      'Product Manager',
      'Project Manager',
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'Mobile Developer',
      'Game Developer',
      'Machine Learning Engineer',
      'AI Engineer',
      'Blockchain Developer',
      'Security Engineer',
      'Site Reliability Engineer (SRE)',
      'Solutions Architect',
      'Technical Writer',
      'QA Lead',
      'DevOps Lead',
      'Engineering Manager',
      'VP of Engineering'
    ],
    'Finanzas': [
      'Business Analyst',
      'Finance',
      'CFO',
      'Financial Analyst',
      'Controller',
      'Accounting Manager',
      'Treasury Manager',
      'Risk Manager',
      'Investment Analyst',
      'Credit Analyst',
      'Auditor',
      'Tax Specialist',
      'Budget Analyst',
      'Financial Planning Analyst',
      'Compliance Officer',
      'Finance Director',
      'VP of Finance'
    ],
    'Administración de empresas': [
      'Manager / Director',
      'Recruiter',
      'Consultant',
      'VP / C-Level',
      'Sales / Pre-Sales',
      'CEO',
      'COO',
      'CMO',
      'CHRO',
      'Operations Manager',
      'General Manager',
      'Business Development Manager',
      'Strategy Manager',
      'Project Manager',
      'Program Manager',
      'Product Manager',
      'Marketing Manager',
      'HR Manager',
      'Operations Director',
      'Business Development Director'
    ]
  };

  const loadOptions = async () => {
    try {
      const rubros = [
        'Tecnología',
        'Finanzas',
        'Administración de empresas'
      ];
      
      console.log('Cargando rubros:', rubros, 'Timestamp:', new Date().toISOString());
      
      setOptions({
        rubros: rubros,
        posiciones: [], // Se llenará dinámicamente
        regiones: [
          'Ciudad Autónoma de Buenos Aires',
          'Buenos Aires',
          'Córdoba',
          'Santa Fe',
          'Mendoza',
          'Tucumán',
          'Entre Ríos',
          'Salta',
          'Misiones',
          'Chaco',
          'Corrientes',
          'Santiago del Estero',
          'San Juan',
          'Jujuy',
          'Río Negro',
          'Formosa',
          'Neuquén',
          'Chubut',
          'San Luis',
          'La Pampa',
          'La Rioja',
          'Catamarca',
          'Tierra del Fuego',
          'Santa Cruz'
        ],
        seniorities: [
          'Junior',
          'Semi-Senior',
          'Senior'
        ]
      });
    } catch (error) {
      console.error('Error cargando opciones:', error);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'rubro') {
      // Cuando cambia el rubro, actualizar las posiciones disponibles
      const newPositions = positionsByRubro[value] || [];
      setOptions(prev => ({
        ...prev,
        posiciones: [...newPositions, 'Otro']
      }));
      
      // Limpiar la posición seleccionada
      setFormData(prev => ({
        ...prev,
        rubro: value,
        posicion: '',
        region: prev.region,
        seniority: prev.seniority
      }));
      
      // Resetear campos relacionados
      setShowCustomPosition(false);
      setCustomPosition('');
    } else if (field === 'posicion') {
      if (value === 'Otro') {
        setShowCustomPosition(true);
        setFormData(prev => ({
          ...prev,
          posicion: ''
        }));
      } else {
        setShowCustomPosition(false);
        setCustomPosition('');
        setFormData(prev => ({
          ...prev,
          posicion: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    setError(null);
  };

  const handleCustomPositionChange = (value) => {
    setCustomPosition(value);
    setFormData(prev => ({
      ...prev,
      posicion: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.rubro || !formData.posicion || !formData.region || !formData.seniority) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (showCustomPosition && !customPosition.trim()) {
      setError('Por favor ingresa el nombre de la posición');
      return;
    }

    // Verificar acceso a estimación salarial con restricciones de suscripción
    await executeWithSubscriptionCheck('salary_estimation', async () => {
      setLoading(true);
      setError(null);
      setResults(null);

      try {
        const response = await salaryEstimationService.estimateSalary(formData);
        setResults(response);
      } catch (error) {
        console.error('Error estimando salario:', error);
        setError('Error al estimar el salario. Por favor intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="salary-estimator">
      <div className="salary-estimator-header">
        <h1>Estimador de sueldo</h1>
      </div>

      <div className="salary-form-container">
        <form onSubmit={handleSubmit} className="salary-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="rubro">Rubro</label>
              <select
                id="rubro"
                value={formData.rubro}
                onChange={(e) => handleInputChange('rubro', e.target.value)}
                className="form-select"
              >
                <option value="">Seleccionar</option>
                {options.rubros.map(rubro => (
                  <option key={rubro} value={rubro}>{rubro}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="posicion">Posición</label>
              <select
                id="posicion"
                value={formData.posicion}
                onChange={(e) => handleInputChange('posicion', e.target.value)}
                className="form-select"
                disabled={!formData.rubro}
              >
                <option value="">{formData.rubro ? 'Seleccionar' : 'Primero selecciona un rubro'}</option>
                {options.posiciones.map(posicion => (
                  <option key={posicion} value={posicion}>{posicion}</option>
                ))}
              </select>
              
              {showCustomPosition && (
                <div className="custom-position-field">
                  <input
                    type="text"
                    placeholder="Ingresa el nombre de la posición"
                    value={customPosition}
                    onChange={(e) => handleCustomPositionChange(e.target.value)}
                    className="form-input"
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="region">Región</label>
              <select
                id="region"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                className="form-select"
              >
                <option value="">Seleccionar</option>
                {options.regiones.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="seniority">Seniority</label>
              <select
                id="seniority"
                value={formData.seniority}
                onChange={(e) => handleInputChange('seniority', e.target.value)}
                className="form-select"
              >
                <option value="">Seleccionar</option>
                {options.seniorities.map(seniority => (
                  <option key={seniority} value={seniority}>{seniority}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-estimate"
              disabled={loading}
            >
              {loading ? 'Estimando...' : 'Estimar'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {results && (
        <div className="results-section">
          <div className="results-cards">
            <div className="result-card ml-card">
              <div className="card-content">
                <div className="salary-amount">
                  {formatCurrency(results.ml_estimate_ars)}
                </div>
                <div className="salary-period">/mes</div>
                <div className="card-source">
                  Según encuesta de SysArmy
                </div>
              </div>
            </div>

            <div className="result-card gpt-card">
              <div className="card-content">
                <div className="salary-amount">
                  {formatCurrency(results.gpt_estimate_ars)}
                </div>
                <div className="salary-period">/mes</div>
                <div className="card-source">
                  Según estimación de ChatGPT
                </div>
              </div>
            </div>
          </div>

          {results.citations && results.citations.length > 0 && (
            <div className="citations-section">
              <h4>Fuentes consultadas:</h4>
              <ul className="citations-list">
                {results.citations.map((citation, index) => (
                  <li key={index}>
                    <a 
                      href={citation.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="citation-link"
                    >
                      {citation.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="disclaimer">
            <div className="disclaimer-icon">💡</div>
            <p>
              Recuerda que puedes preguntarle al entrevistador por el rango salarial 
              establecido para la posición que buscan
            </p>
          </div>
        </div>
      )}

      {/* Modal de restricción de suscripción */}
      <SubscriptionRestrictionModal
        isOpen={isRestrictionModalOpen}
        onClose={closeRestrictionModal}
        feature={restrictedFeature}
        title="Funcionalidad no disponible"
        showUpgradeButton={true}
      />
    </div>
  );
};

export default SalaryEstimator;
