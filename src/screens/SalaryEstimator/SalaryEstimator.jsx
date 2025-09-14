import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { salaryEstimationService } from '../../services/salaryEstimationService';
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
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Cargar opciones del dataset
  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      // Por ahora usamos opciones hardcodeadas basadas en el dataset
      // En el futuro se pueden cargar dinámicamente desde la API
      setOptions({
        rubros: [
          'Tecnología',
          'Finanzas',
          'Salud',
          'Educación',
          'Marketing',
          'Recursos Humanos',
          'Ventas',
          'Operaciones',
          'Consultoría',
          'Otros'
        ],
        posiciones: [
          'Developer',
          'QA / Tester',
          'Manager / Director',
          'Infosec',
          'UX Designer',
          'DevOps',
          'Data Scientist',
          'Product Manager',
          'Scrum Master',
          'Cloud Engineer',
          'Frontend Developer',
          'Backend Developer',
          'Full Stack Developer',
          'Mobile Developer',
          'SysAdmin',
          'DBA',
          'Analista',
          'Consultor',
          'Arquitecto de Software',
          'Tech Lead'
        ],
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
          'Senior',
          'Lead',
          'Principal',
          'Staff',
          'Architect'
        ]
      });
    } catch (error) {
      console.error('Error cargando opciones:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.rubro || !formData.posicion || !formData.region || !formData.seniority) {
      setError('Por favor completa todos los campos');
      return;
    }

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
        <p>Obtén una estimación de salario basada en datos reales del mercado argentino</p>
      </div>

      <form onSubmit={handleSubmit} className="salary-form">
        <div className="form-row">
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
            >
              <option value="">Seleccionar</option>
              {options.posiciones.map(posicion => (
                <option key={posicion} value={posicion}>{posicion}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
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

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {results && (
        <div className="results-section">
          <div className="results-cards">
            <div className="result-card ml-card">
              <div className="card-header">
                <h3>Según encuesta de SysArmy</h3>
                <div className="card-icon">📊</div>
              </div>
              <div className="card-content">
                <div className="salary-amount">
                  {formatCurrency(results.ml_estimate_ars)}
                </div>
                <div className="salary-period">/mes</div>
                <div className="card-meta">
                  <small>Modelo ML entrenado con datos reales</small>
                </div>
              </div>
            </div>

            <div className="result-card gpt-card">
              <div className="card-header">
                <h3>Según estimación de ChatGPT</h3>
                <div className="card-icon">🤖</div>
              </div>
              <div className="card-content">
                <div className="salary-amount">
                  {formatCurrency(results.gpt_estimate_ars)}
                </div>
                <div className="salary-period">/mes</div>
                <div className="card-meta">
                  <small>Análisis con búsqueda web actualizada</small>
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
    </div>
  );
};

export default SalaryEstimator;
