<?php
require_once '../modelo/basedatos/Conexion.php';
require_once '../modelo/vo/Usuario.php';
require_once '../modelo/dao/UsuarioDao.php';
require_once './GenericoControlador.php';
require_once './GestionDatos.php';
require_once './excepcion/ValidacionExcepcion.php';
require_once './util/Validacion.php';
require_once '../vendor/composer/vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class GestionUsuarioControlador extends GenericoControlador {

    private $usuarioDAO;
    private $arrayGeneral;

    public function __construct( &$cnn = NULL ) {
        if ( empty( $cnn ) ) {
            $cnn = Conexion::conectar();
        }
        $this->usuarioDAO = new UsuarioDAO( $cnn );
        $this->arrayGeneral = Datosdiagnostico::General();
    }

    public function iniciarSesion() {
        try {
            Validacion::validar( ['nit' => 'obligatorio', 'razon_social' => 'obligatorio', 'clave' => 'obligatorio'], $_POST );
            $admin = "Dexcon";
            $usuarioVO = new Usuario;
            $usuarioVO->setFecha ( $_POST ['fecha'] );
            $usuarioVO->setRazon_social ( $_POST['razon_social'] );
            $usuarioVO->setNit ( $_POST['nit'] ) ;
            $validacion = $this->usuarioDAO->validar( $_POST['clave'] );
            if ( empty( $validacion ) ) {
                $this->respuestaJSON( ['codigo' => 3] );
            } else {
                $consulta = $this->usuarioDAO->consultar( $_POST['razon_social'], $_POST['nit'] );
                if ( empty( $consulta ) && $validacion->usuario === $admin ) {
                    $infoUsuario =  $this->usuarioDAO->insertar( $usuarioVO );
                    session_start();
                    $_SESSION['usuario_planfuturo'] = [$infoUsuario, $validacion->usuario];
                    $this->respuestaJSON( ['codigo' => 2, 'mensaje' => 'Se insertó correctamente'] );
                } else if ( empty( $consulta ) && $validacion->usuario != $admin ) {
                    $this->respuestaJSON( ['codigo' => 4] );
                } else {
                    session_start();
                    $_SESSION['usuario_planfuturo'] = [$consulta->id_empresa, $validacion->usuario];
                    $this->respuestaJSON( ['codigo' => 1] );
                }
            }
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function consultar_datos() {
        try {
            session_start();
            $id_empresa = $_SESSION['usuario_planfuturo'][0];
            $datos = $this->usuarioDAO->consultar_datos( $id_empresa );
            if ( $datos->axiologica != "" ) {
                $axiologica = explode( "|", $datos->axiologica );
                $generalArray = [];
                for ( $i = 0; $i < count( $axiologica );
                $i++ ) {
                    $axio = $axiologica[$i];
                    $axio_datos = explode( "•", $axio );
                    $generalArray[$axio_datos[0]][$axio_datos[1]] = $axio_datos[2];
                }
                $datos->axiologica = $generalArray;
            }
            //Procesos
            if ( $datos->procesos != "" ) {
                $procesos = explode( "|", $datos->procesos );
                $generalArray = [];
                for ( $i = 0; $i < count( $procesos );
                $i++ ) {
                    $proceso = $procesos[$i];
                    $proceso_datos = explode( "•", $proceso );
                    $generalArray[$proceso_datos[0]][$proceso_datos[1]][$proceso_datos[2]] = $proceso_datos[3];
                }
                $datos->procesos = $generalArray;
            }
            //Seguimiento
            if ( $datos->seguimientos != "" ) {
                $seguimientos = explode( "|", $datos->seguimientos );
                $generalArray = [];
                for ( $i = 0; $i < count( $seguimientos );
                $i++ ) {
                    $seguimiento = $seguimientos[$i];
                    $seg_datos = explode( "•", $seguimiento );
                    $generalArray[$seg_datos[0]][$seg_datos[1]] = $seg_datos[2];
                }
                $datos->seguimientos = $generalArray;
            }
            $datos->usuario = $_SESSION['usuario_planfuturo'][1];
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se consultó correctamente', 'datos' => $datos] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function modificar_empresa() {
        try {
            Validacion::validar( ['nit' => 'obligatorio', 'razon_social' => 'obligatorio'], $_POST );
            $usuarioVO = new Usuario;
            $usuarioVO->setId_empresa( $_POST['id_empresa'] );
            $usuarioVO->setNit( $_POST['nit'] );
            $usuarioVO->setRazon_social( $_POST['razon_social'] );
            $usuarioVO->setFecha( $_POST['fecha'] );
            $usuarioVO->setHorizonte_inicial( $_POST['horizonte_inicial'] );
            $usuarioVO->setHorizonte_final( $_POST['horizonte_final'] );
            $usuarioVO->setHorizonte_noanios( $_POST['horizonte_noanios'] );
            $usuarioVO->setColor( $_POST['color'] );
            $usuarioVO->setEstrategas( $_POST['estrategas'] );
            if ( !isset( $_FILES['logo']['error'] ) ) {
                $this->usuarioDAO->modificar_empresa( $usuarioVO );
                $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se modificó correctamente' ] );
            } else {
                //subir imagen
                $extension = pathinfo( $_FILES['logo']['name'] );
                if ( $extension['extension'] === "png" or $extension['extension'] === "jpg" ) {
                    move_uploaded_file( $_FILES['logo']['tmp_name'], '../files/' . $_FILES['logo']['name'] );
                    $usuarioVO->setLogo( "../files/".$_FILES['logo']['name'] );
                    $this->usuarioDAO->modificar_empresa_logo( $usuarioVO );
                    $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se modificó correctamente' ] );
                } else {
                    $this->respuestaJSON( ['codigo' => 0, 'mensaje' => 'Solo tipo de imagen png/jpg' ] );
                }
            }
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_axiologica() {
        try {
            Validacion::validar( ['axiologica' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $axiologica = $_POST['axiologica'];
            $this->usuarioDAO->agregar_axiologica( $id_empresa, $axiologica );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_referencia() {
        try {
            Validacion::validar( ['referencia' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $referencia = $_POST['referencia'];
            $this->usuarioDAO->agregar_referencia( $id_empresa, $referencia );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_principio() {
        try {
            Validacion::validar( ['principio' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $principio = $_POST['principio'];
            $this->usuarioDAO->agregar_principio( $id_empresa, $principio );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_vision() {
        try {
            Validacion::validar( ['vision_text' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $vision_text = $_POST['vision_text'];
            $this->usuarioDAO->agregar_vision( $id_empresa, $vision_text );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_mision() {
        try {
            Validacion::validar( ['mision_text' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $mision_text = $_POST['mision_text'];
            $this->usuarioDAO->agregar_mision( $id_empresa, $mision_text );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }
    
    public function agregar_procesos() {
        try {
            Validacion::validar( ['general' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $general = $_POST['general'];
            $this->usuarioDAO->agregar_procesos( $id_empresa, $general );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }
    
    public function consultar_dignostico() {
        try {
            Validacion::validar( ['id_empresa' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $datos = $this->usuarioDAO->consultar_dignostico( $id_empresa );
            //Datos PCI & POAM
            if ( $datos ) {
                if ( $datos->pci != "" ) {
                    $pci = explode( "|", $datos->pci );
                    $generalArray = [];
                    for ( $i = 0; $i < count( $pci );
                    $i++ ) {
                        $pci_dato = $pci[$i];
                        $pci_datos = explode( "•", $pci_dato );
                        $generalArray[$pci_datos[0]][$pci_datos[1]][$pci_datos[2]] = $pci_datos[3];
                    }
                    $datos->pci = $generalArray;
                } else {
                    $datos->pci = $this->arrayGeneral["pci"];
                }
                if ( $datos->poam != "" ) {
                    $poam = explode( "|", $datos->poam );
                    $generalArray = [];
                    for ( $i = 0; $i < count( $poam );
                    $i++ ) {
                        $poam_dato = $poam[$i];
                        $poam_datos = explode( "•", $poam_dato );
                        $generalArray[$poam_datos[0]][$poam_datos[1]][$poam_datos[2]] = $poam_datos[3];
                    }
                    $datos->poam = $generalArray;
                } else {
                    $datos->poam = $this->arrayGeneral["poam"];
                }
                //Datos DOFA ANALISIS
                if ( $datos->dofa_analisis != "" ) {
                    $analisis = explode( "|", $datos->dofa_analisis );
                    $generalArray = [];
                    for ( $i = 0; $i < count( $analisis );
                    $i++ ) {
                        $analisis_dato = $analisis[$i];
                        $analisis_datos = explode( "•", $analisis_dato );
                        $generalArray[$analisis_datos[0]][$analisis_datos[1]][$analisis_datos[2]] = $analisis_datos[3];
                    }
                    $datos->dofa_analisis = $generalArray;
                }
                //Interes
                if ( $datos->interes != "" ) {
                    $interes = explode( "|", $datos->interes );
                    $generalArray = [];
                    for ( $i = 0; $i < count( $interes );
                    $i++ ) {
                        $interes_dato = $interes[$i];
                        $interes_datos = explode( "•", $interes_dato );
                        $generalArray[$interes_datos[0]][$interes_datos[1]]= $interes_datos[2];
                    }
                    $datos->interes = $generalArray;
                }
            }
            //Si no existe empresa en la tabla diagnostico
            if ( !$datos ) {
                $datos = new stdClass();
                $datos->pci = $this->arrayGeneral["pci"];
                $datos->poam = $this->arrayGeneral["poam"];
            }

            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se consultó correctamente', 'datos' => $datos] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function consultar_usuarios() {
        try {
            Validacion::validar( ['usuario' => 'obligatorio'], $_POST );
            $datos = $this->usuarioDAO->consultar_usuarios();
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se consultó correctamente', 'datos' => $datos] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function crear_usuario() {
        try {
            Validacion::validar( ['usuario' => 'obligatorio', 'clave' => 'obligatorio'], $_POST );
            $usuario = $_POST['usuario'];
            $clave = $_POST['clave'];
            $datos = $this->usuarioDAO->crear_usuario( $usuario, $clave );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente', 'datos' => $datos] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function actualizar_usuario() {
        try {
            Validacion::validar( ['idx' => 'obligatorio', 'clave' => 'obligatorio'], $_POST );
            $clave = $_POST['clave'];
            $id = $_POST['idx'];
            $datos = $this->usuarioDAO->actualizar_usuario( $clave, $id );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function eliminar_usuario() {
        try {
            Validacion::validar( ['idx' => 'obligatorio'], $_POST );
            $id = $_POST['idx'];
            $datos = $this->usuarioDAO->eliminar_usuario( $id );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se eliminó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }
        
    public function agregar_interes() {
        try {
            Validacion::validar( ['general' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $general = $_POST['general'];
            $consultar_dignostico = $this->usuarioDAO->consultar_dignostico( $id_empresa );
            if ( !$consultar_dignostico ) {
                $this->usuarioDAO->agregar_diagnostico( $id_empresa );
            }
            $this->usuarioDAO->agregar_interes( $id_empresa, $general );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }
        
    public function agregar_pci() {
        try {
            Validacion::validar( ['general' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $general = $_POST['general'];
            $consultar_dignostico = $this->usuarioDAO->consultar_dignostico( $id_empresa );
            if ( !$consultar_dignostico ) {
                $this->usuarioDAO->agregar_diagnostico( $id_empresa );
            }
            $this->usuarioDAO->agregar_pci( $id_empresa, $general );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_poam() {
        try {
            Validacion::validar( ['general' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $general = $_POST['general'];
            $consultar_dignostico = $this->usuarioDAO->consultar_dignostico( $id_empresa );
            if ( !$consultar_dignostico ) {
                $this->usuarioDAO->agregar_diagnostico( $id_empresa );
            }
            $this->usuarioDAO->agregar_poam( $id_empresa, $general );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_dofa() {
        try {
            Validacion::validar( ['dofa_text' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $dofa_text = $_POST['dofa_text'];
            $consultar_dignostico = $this->usuarioDAO->consultar_dignostico( $id_empresa );
            if ( !$consultar_dignostico ) {
                $this->usuarioDAO->agregar_diagnostico( $id_empresa, $this->arrayGeneral );
            }
            $this->usuarioDAO->agregar_dofa( $id_empresa, $dofa_text );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_analisis() {
        try {
            Validacion::validar( ['campos' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $campos = $_POST['campos'];
            $consultar_dignostico = $this->usuarioDAO->consultar_dignostico( $id_empresa );
            if ( !$consultar_dignostico ) {
                $this->usuarioDAO->agregar_diagnostico( $id_empresa, $this->arrayGeneral );
            }
            $this->usuarioDAO->agregar_analisis( $id_empresa, $campos );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function consultar_estrategias() {
        try {
            Validacion::validar( ['id_empresa' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $datos = $this->usuarioDAO->consultar_estrategias( $id_empresa );
            if ( $datos ) {
                //seguimientos
                if ( $datos->seguimientos != "" ) {
                    $seg = explode( "|", $datos->seguimientos );
                    $generalArray = [];
                    for ( $i = 0; $i < count( $seg );
                    $i++ ) {
                        $seg_dato = $seg[$i];
                        $seg_datos = explode( "•", $seg_dato );
                        $generalArray[$seg_datos[0]][$seg_datos[1]] = $seg_datos[2];
                    }
                    $datos->seguimientos = $generalArray;
                }
                //Matriz bcg
                if ( $datos->bcg != "" ) {
                    $bcg_dat = explode( "|", $datos->bcg );
                    $generalArray = [];
                    for ( $i = 0; $i < count( $bcg_dat );
                    $i++ ) {
                        $bcg_dato = $bcg_dat[$i];
                        $bcg_datos = explode( "•", $bcg_dato );
                        $generalArray[$bcg_datos[0]][$bcg_datos[1]] = $bcg_datos[2];
                    }
                    $datos->bcg = $generalArray;
                }
                //Axiologicas 2
                if ( $datos->axiologica != "" ) {
                    $axiologica = explode( "|", $datos->axiologica );
                    $generalArray = [];
                    for ( $i = 0; $i < count( $axiologica );
                    $i++ ) {
                        $axio = $axiologica[$i];
                        $axio_datos = explode( "•", $axio );
                        $generalArray[$axio_datos[0]][$axio_datos[1]] = $axio_datos[2];
                    }
                    $datos->axiologica = $generalArray;
                }
                //Estrategias general
                if ( $datos->general != "" ) {
                    $gnral = explode( "|", $datos->general );
                    $generalArray = [];
                    for ( $i = 0; $i < count( $gnral );
                    $i++ ) {
                        $general_dato = $gnral[$i];
                        $general_datos = explode( "•", $general_dato );
                        $generalArray[$general_datos[0]][$general_datos[1]][$general_datos[2]] = $general_datos[3];
                    }
                    $datos->general = $generalArray;
                }
                //Cmi futuro
                if ( $datos->cmi_futuro != "" ) {
                    $gnral = explode( "|", $datos->cmi_futuro );
                    $generalArray = [];
                    for ( $i = 0; $i < count( $gnral );
                    $i++ ) {
                        $general_dato = $gnral[$i];
                        $general_datos = explode( "•", $general_dato );
                        $generalArray[$general_datos[0]][$general_datos[1]] = $general_datos[2];
                    }
                    $datos->cmi_futuro = $generalArray;
                }
                //Cmi objetivos
                if ( $datos->cmi_objetivos != "" ) {
                    $gnral = explode( "|", $datos->cmi_objetivos );
                    $generalArray = [];
                    for ( $i = 0; $i < count( $gnral );
                    $i++ ) {
                        $general_dato = $gnral[$i];
                        $general_datos = explode( "•", $general_dato );
                        $generalArray[$general_datos[0]][$general_datos[1]] = $general_datos[2];
                    }
                    $datos->cmi_objetivos = $generalArray;
                }
                //Cmi
                if ( $datos->cmi != "" ) {
                    $resultado_json = json_decode( $datos->cmi );
                    $datos->cmi = $resultado_json;
                }
            }
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se consultó correctamente', 'datos' => $datos] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_seguimientos() {
        try {
            Validacion::validar( ['campos' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $campos = $_POST['campos'];
            $consultar_estrategias = $this->usuarioDAO->consultar_estrategias( $id_empresa );
            if ( !$consultar_estrategias ) {
                $this->usuarioDAO->agregar_estrategias( $id_empresa );
            }
            $this->usuarioDAO->agregar_seguimientos( $id_empresa, $campos );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_fuerzas() {
        try {
            Validacion::validar( ['fuerzas' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $fuerzas = $_POST['fuerzas'];
            $consultar_estrategias = $this->usuarioDAO->consultar_estrategias( $id_empresa );
            if ( !$consultar_estrategias ) {
                $this->usuarioDAO->agregar_estrategias( $id_empresa );
            }
            $this->usuarioDAO->agregar_fuerzas( $id_empresa, $fuerzas );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_bcg() {
        try {
            Validacion::validar( ['general' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $general = $_POST['general'];
            $consultar_estrategias = $this->usuarioDAO->consultar_estrategias( $id_empresa );
            if ( !$consultar_estrategias ) {
                $this->usuarioDAO->agregar_estrategias( $id_empresa );
            }
            $this->usuarioDAO->agregar_bcg( $id_empresa, $general );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_axiologica2() {
        try {
            Validacion::validar( ['axiologica' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $axiologica = $_POST['axiologica'];
            $consultar_estrategias = $this->usuarioDAO->consultar_estrategias( $id_empresa );
            if ( !$consultar_estrategias ) {
                $this->usuarioDAO->agregar_estrategias( $id_empresa );
            }
            $this->usuarioDAO->agregar_axiologica2( $id_empresa, $axiologica );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_referencia2() {
        try {
            Validacion::validar( ['referencia' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $referencia = $_POST['referencia'];
            $consultar_estrategias = $this->usuarioDAO->consultar_estrategias( $id_empresa );
            if ( !$consultar_estrategias ) {
                $this->usuarioDAO->agregar_estrategias( $id_empresa );
            }
            $this->usuarioDAO->agregar_referencia2( $id_empresa, $referencia );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_principio2() {
        try {
            Validacion::validar( ['principio' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $principio = $_POST['principio'];
            $consultar_estrategias = $this->usuarioDAO->consultar_estrategias( $id_empresa );
            if ( !$consultar_estrategias ) {
                $this->usuarioDAO->agregar_estrategias( $id_empresa );
            }
            $this->usuarioDAO->agregar_principio2( $id_empresa, $principio );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_general() {
        try {
            Validacion::validar( ['general' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $general = $_POST['general'];
            $consultar_estrategias = $this->usuarioDAO->consultar_estrategias( $id_empresa );
            if ( !$consultar_estrategias ) {
                $this->usuarioDAO->agregar_estrategias( $id_empresa );
            }
            $this->usuarioDAO->agregar_general( $id_empresa, $general );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_cmifuturo() {
        try {
            Validacion::validar( ['general' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $general = $_POST['general'];
            $consultar_estrategias = $this->usuarioDAO->consultar_estrategias( $id_empresa );
            if ( !$consultar_estrategias ) {
                $this->usuarioDAO->agregar_estrategias( $id_empresa );
            }
            $this->usuarioDAO->agregar_cmifuturo( $id_empresa, $general );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_objetivos() {
        try {
            Validacion::validar( ['general' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $general = $_POST['general'];
            $consultar_estrategias = $this->usuarioDAO->consultar_estrategias( $id_empresa );
            if ( !$consultar_estrategias ) {
                $this->usuarioDAO->agregar_estrategias( $id_empresa );
            }
            $this->usuarioDAO->agregar_objetivos( $id_empresa, $general );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function agregar_cmi() {
        try {
            Validacion::validar( ['anio' => 'obligatorio', 'general' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $general = $_POST['general'];
            $anio = $_POST['anio'];
            $consultar_estrategias = $this->usuarioDAO->consultar_estrategias( $id_empresa );
            if ( !$consultar_estrategias ) {
                $this->usuarioDAO->agregar_estrategias( $id_empresa );
            }
            //Trae los arreglos actuales de cmi y los junta con los datos nuevos
            $datos = $this->usuarioDAO->consultar_estrategias( $id_empresa );
            $gnral = explode( "|", $general );
            $generalArray = [];
            if ( $datos->cmi != "" ) {
                $generalArray = json_decode( $datos->cmi, true );
            }
            //Borra el anterior array para insertar el nuevo
            unset( $generalArray[$anio] );
            for ( $i = 0; $i < count( $gnral );
            $i++ ) {
                $general_dato = $gnral[$i];
                $general_datos = explode( "•", $general_dato );
                if ( !isset( $general_datos[5] ) ) {
                    $generalArray[$general_datos[0]][$general_datos[1]][$general_datos[2]][$general_datos[3]] = $general_datos[4];
                } else {
                    $generalArray[$general_datos[0]][$general_datos[1]][$general_datos[2]][$general_datos[3]][$general_datos[4]] = $general_datos[5];
                }
            }
            $arreglo = json_encode( $generalArray );
            $this->usuarioDAO->agregar_cmi( $id_empresa, $arreglo );
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se grabó correctamente' ] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function bcg_pdf() {
        try {
            Validacion::validar( ['respuesta' => 'obligatorio'], $_POST );
            $resultados = $_POST ['respuesta'];
            $razon_social = $_POST['razon_social'];
            $ruta = "../vendor/fontawesome-free/svgs/solid/";
            $data_tipo = $_POST['tipo'];
            $data_icono = $_POST['icono'];
            $data_color = $_POST['color'];
            $data_descr = $_POST['descr'];
            $header = '<head> 
                      <style>
                            h1 { font-family: chronicle;font-weight: normal; } 
                            h4 { font-family: chronicle; font-size: 10pt; text-align:center; margin-top: 0; margin-bottom: 0; }
                            h6 { font-family: chronicle; font-size: 6pt; font-weight: 100; text-align:center; margin-top: 0; margin-bottom: 0;}
                            table, td{border-collapse: collapse; color: black !important; text-align: center;font-size:12px; }
                            body {font-family: opensans;}
                      </style> 
                   </head>';
            // Cabecera del documento
            $cabecera = "<div style='margin-bottom:7px;'> 
                            <div style='float: left; width: 10%; text-align:left;' > 
                                <img src='../img/logo.png'>
                            </div> 
                            <div style='float:left; vertical-align: top; padding-left: 18px;'>
                                <h1 style='font-size: 20pt;margin-left:70px;'>Matriz Boston Consulting Group</h1> 
                            </div>
                        </div>";
            //Cuerpo del documento
            $tablas = "<table style='width:100%;'>";
            $tablas .= "<tr>";
            for ( $i = 1; $i <= count( $resultados );
            $i++ ) {
                $tablas .=
                "<td style='width:50%;vertical-align:top;padding:0;height:100'>
                        <table style='width:100%;height: 100%;'>
                            <tr >
                                <td style='width:40%;border: 0.5px solid #858796;text-align: center;background-color:black; color:white;padding:0;'>{$data_tipo[$i]}</td>
                                <td style='width:60%;border: 0.5px solid #858796;text-align: center;padding:0;'><img style='width:18px;' src='{$ruta}{$data_icono[$i]}.svg'></td>
                            </tr>
                            <tr>
                                <td style='border: 0.5px solid #858796;padding:10px;height:100%;background-color:#{$data_color[$i]}'>{$data_descr[$i]}</td>
                                <td style='vertical-align:top;'>";
                $data = $resultados[$i];

                for ( $b = 0; $b < count( $data );
                $b++ ) {
                    if ( $data[$b] != "" ) {
                        $tablas .= "<div style='width:100%;border: 0.5px solid #858796;color:black;'>
                                    <table style='width:100%;height: 100%;padding:0'>
                                        <tr>
                                            <td style='border: 0.5px solid #858796;padding:0;'> {$data[$b]}</td>
                                        </tr>      
                                    </table>";
                    }

                }
                $tablas .= "<td>
                        </tr>
                    </table>
                </td>";
                $tablas .= ( $i == 2 ) ? "</tr><tr>" : "";
            }
            $tablas .= "</tr>
                    </table>";
            $ehtml =  "<html> 
                        <body> 
                            {$cabecera}
                            {$tablas}
                            <div style='clear: both; margin: 0pt; padding: 0pt; '></div>
                        </body>                    
                  </html>";

            $mpdf = new \Mpdf\Mpdf( ['mode' => 'utf-8', 'format' => 'A4-L'] );
            $mpdf->WriteHTML( $ehtml );
            $pdfString = $mpdf->Output( '', 'S' );
            $pdfBase64 = base64_encode( $pdfString );
            $PDF = 'data:application/pdf;base64,' . $pdfBase64;
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se generó correctamente', 'reporte' => $PDF, 'nombre' => $razon_social, 'tipo' => 'BCG', 'ext' => '.pdf'] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function bcg_excel() {
        try {
            Validacion::validar( ['respuesta' => 'obligatorio'], $_POST );
            $resultados = $_POST ['respuesta'];
            $razon_social = $_POST['razon_social'];
            $ruta = "../vendor/fontawesome-free/svgs/solid/";
            $data_tipo = $_POST['tipo'];
            $data_icono = $_POST['icono'];
            $data_color = $_POST['color'];
            $data_descr = $_POST['descr'];
            //Celas
            $spreadsheet = new Spreadsheet();
            $spreadsheet->getActiveSheet()->getColumnDimension( 'A' )->setWidth( 50, 'pt' );
            $spreadsheet->getActiveSheet()->getColumnDimension( 'B' )->setAutoSize( true );
            $spreadsheet->getActiveSheet()->getColumnDimension( 'C' )->setWidth( 50, 'pt' );
            $spreadsheet->getActiveSheet()->getColumnDimension( 'D' )->setAutoSize( true );
            $spreadsheet->getActiveSheet()->mergeCells( "A1:E3" );
            $spreadsheet->getActiveSheet()->getStyle( 'A1:H50' )->getAlignment()->setWrapText( true );
            //Cabecera del archivo
            $spreadsheet->getActiveSheet()->getStyle( "A1" )->getFont()->setSize( 19 )->setBold( true );
            $spreadsheet->getActiveSheet()->getStyle( "A5:D5" )->getFont()->setSize( 16 )->setBold( true );
            $spreadsheet->getActiveSheet()->getStyle( "A5:D5" )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->getStyle( "A5:D5" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( '00000' );
            $spreadsheet->getActiveSheet()->getStyle( "A5:D5" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
            $spreadsheet->getActiveSheet()->getStyle( 'A1' )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->getStyle( 'A1:A50' )->getAlignment()->setVertical( \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER );
            $spreadsheet->getActiveSheet()->getStyle( 'C1:C50' )->getAlignment()->setVertical( \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER );
            //Logo dexcon
            $drawing = new \PhpOffice\PhpSpreadsheet\Worksheet\Drawing();
            $drawing->setPath( "../img/logo.png" );
            $drawing->setName( 'Logo' );
            $drawing->setCoordinates( 'A1' );
            $drawing->setWidthAndHeight( 100, 100 );
            $drawing->setWorksheet( $spreadsheet->setActiveSheetIndex( 0 ) );
            $sheet = $spreadsheet->getActiveSheet();
            //Titulo
            $sheet->setCellValue( 'A1', 'Matriz Boston Consulting Group' );
            //Celdas
            $sheet->setCellValue( 'A5', '🌟' );
            $sheet->setCellValue( 'B5', 'ESTRELLAS' );
            $sheet->setCellValue( 'C5', '?' );
            $sheet->setCellValue( 'D5', 'INTERROGANTE' );
            //Datos
            $campos = [1 => "A6", 2 => "C6", 3 => "A13", 4 => "C13"];
            $campos_Datos = [1 => "B", 2 => "D", 3 => "B", 4 => "D"];
            $ad = 11;
            for ( $i = 1; $i < 3; $i++ ) {
                $data = $resultados[$i];
                $texto = str_replace( "<br>", "\n", $data_descr[$i] );
                $spreadsheet->getActiveSheet()->getStyle( $campos[$i] )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( $data_color[$i] );
                $sheet->setCellValue( $campos[$i], $texto );
                $ab = 6;
                for ( $b = 0; $b < count( $data );
                $b++ ) {
                    $sheet->setCellValue( "{$campos_Datos[$i]}{$ab}", $data[$b] );
                    $ab++;
                }
                $ad = ( $ab > $ad ) ? $ab : $ad;
            }
            if ( $ad < 12 ) {
                $abcd = ( $ad + 1 );
                $spreadsheet->getActiveSheet()->mergeCells( "A6:A11" );
                $spreadsheet->getActiveSheet()->mergeCells( "C6:C11" );
                $spreadsheet->getActiveSheet()->getStyle( "A{$abcd}:D{$abcd}" )->getFont()->setSize( 16 )->setBold( true );
                $spreadsheet->getActiveSheet()->getStyle( "A{$abcd}:D{$abcd}" )->getAlignment()->setHorizontal( 'center' );
                $spreadsheet->getActiveSheet()->getStyle( "A{$abcd}:D{$abcd}" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( '00000' );
                $spreadsheet->getActiveSheet()->getStyle( "A{$abcd}:D{$abcd}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
                $sheet->setCellValue( "A{$abcd}", '🐮' );
                $sheet->setCellValue( "B{$abcd}", 'VACA LECHERA' );
                $sheet->setCellValue( "C{$abcd}", '🐶' );
                $sheet->setCellValue( "D{$abcd}", 'PERRO' );
                $ap = 18;
                for ( $i = 3; $i < 5; $i++ ) {
                    $data = $resultados[$i];
                    $texto = str_replace( "<br>", "\n", $data_descr[$i] );
                    $spreadsheet->getActiveSheet()->getStyle( $campos[$i] )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( $data_color[$i] );
                    $sheet->setCellValue( $campos[$i], $texto );
                    $abe = 13;
                    for ( $b = 0; $b < count( $data );
                    $b++ ) {
                        $sheet->setCellValue( "{$campos_Datos[$i]}{$abe}", $data[$b] );
                        $abe++;
                    }
                    $ap = ( $abe > $ap ) ? $abe : $ap;
                }
                $spreadsheet->getActiveSheet()->mergeCells( "A13:A{$ap}" );
                $spreadsheet->getActiveSheet()->mergeCells( "C13:C{$ap}" );

            } else {
                $abc = ( $ad - 1 );
                $abcd = ( $ad + 1 );
                $campos[3] = "A{$abcd}";
                $campos[4] = "C{$abcd}";
                $spreadsheet->getActiveSheet()->mergeCells( "A6:A{$abc}" );
                $spreadsheet->getActiveSheet()->mergeCells( "C6:C{$abc}" );
                $spreadsheet->getActiveSheet()->getStyle( "A{$ad}:D{$ad}" )->getFont()->setSize( 16 )->setBold( true );
                $spreadsheet->getActiveSheet()->getStyle( "A{$ad}:D{$ad}" )->getAlignment()->setHorizontal( 'center' );
                $spreadsheet->getActiveSheet()->getStyle( "A{$ad}:D{$ad}" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( '00000' );
                $spreadsheet->getActiveSheet()->getStyle( "A{$ad}:D{$ad}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
                $sheet->setCellValue( "A{$ad}", '🐮' );
                $sheet->setCellValue( "B{$ad}", 'VACA LECHERA' );
                $sheet->setCellValue( "C{$ad}", '🐶' );
                $sheet->setCellValue( "D{$ad}", 'PERRO' );
                $ap = ( $ad + 5 );
                for ( $i = 3; $i < 5; $i++ ) {
                    $data = $resultados[$i];
                    $texto = str_replace( "<br>", "\n", $data_descr[$i] );
                    $spreadsheet->getActiveSheet()->getStyle( $campos[$i] )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( $data_color[$i] );
                    $sheet->setCellValue( $campos[$i], $texto );
                    $abe = $abcd;
                    for ( $b = 0; $b < count( $data );
                    $b++ ) {
                        $sheet->setCellValue( "{$campos_Datos[$i]}{$abe}", $data[$b] );
                        $abe++;
                    }
                    $ap = ( $abe > $ap ) ? $abe : $ap;
                }
                $apx = ( $ap - 1 );
                $spreadsheet->getActiveSheet()->mergeCells( "A{$abcd}:A{$apx}" );
                $spreadsheet->getActiveSheet()->mergeCells( "C{$abcd}:C{$apx}" );
            }
            $writer = new Xlsx( $spreadsheet );
            ob_start();
            $writer->save( 'php://output' );
            $contenido = ob_get_clean();
            $excelBase64 = base64_encode( $contenido );
            $excel = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' . $excelBase64;
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se generó correctamente', 'reporte' => $excel, 'nombre' => $razon_social, 'tipo' => 'BCG', 'ext' => '.xlsx'] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function scorecard_pdf() {
        try {
            Validacion::validar( ['respuesta' => 'obligatorio', 'objetivos' => 'obligatorio'], $_POST );
            $resultados = $_POST ['respuesta'];
            $objetivos = $_POST ['objetivos'];
            $razon_social = $_POST['razon_social'];
            $header = '<head> 
                      <style>
                            h1 { font-family: chronicle;font-weight: normal; } 
                            h4 { font-family: chronicle; font-size: 10pt; text-align:center; margin-top: 0; margin-bottom: 0; }
                            h6 { font-family: chronicle; font-size: 6pt; font-weight: 100; text-align:center; margin-top: 0; margin-bottom: 0;}
                            table, td{border-collapse: collapse; color: black !important; text-align: center;font-size:12px; }
                            body {font-family: opensans;}
                      </style> 
                   </head>';
            // Cabecera del documento
            $cabecera = "<div style='margin-bottom:15px;'> 
                            <div style='float: left; width: 10%; text-align:left;' > 
                                <img src='../img/logo.png'>
                            </div> 
                            <div style='float:left; vertical-align: top; padding-left: 18px;'>
                                <h1 style='font-size: 20pt;margin-left:70px;'>Cuadro de Mando Integral - Balanced Scorecard</h1> 
                            </div>
                        </div>";
            //Cuerpo del documento
            $mision = str_replace( "\n", "<br>", $resultados[0][0] );
            $vision = str_replace( "\n", "<br>", $resultados[0][1] );
            $valores = str_replace( "\n", "<br>", $resultados[0][2] );
            $politicas = $resultados[1];
            $promesas = $resultados[2];
            $tablas = "<b>Instrucción</b>: <span>Con base en todos los análisis anteriores defina la Misión, Visión, Valores y políticas que asumirá la compañía durante el horizonte estratégico.</span>";
            $tablas .= "<table style='width:100%;'>
                            <tr>
                                <td colspan='3' style='border: 0.5px solid #858796;'><h3>Plan de futuro</h3></td>
                            <tr>
                            <tr>
                                <td style='width:33%;background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Misión</td>
                                <td style='width:33%;background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Visión</td>
                                <td style='width:33%;background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Valores</td>
                            </tr>
                            <tr>
                                <td style='height:100px;border:0.5px solid #858796;vertical-align:top'>{$mision}</td>
                                <td style='height:100px;border:0.5px solid #858796;vertical-align:top'>{$vision}</td>
                                <td style='height:100px;border:0.5px solid #858796;vertical-align:top'>{$valores}</td>
                            </tr>
                            <tr>
                                <td colspan='3' style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'><h3>Politicas de gestión</h3></td>
                            </tr>";
            //Listar politicas
            for ( $i = 0; $i < count( $politicas );
            $i++ ) {
                $tablas .= "<tr>
                                <td colspan='3' style='border:0.5px solid #858796;'>{$politicas[$i]}</td>
                            </tr>";
            }
            $tablas .= "<tr>
                            <td colspan='3' style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'><h3>Promesa de servicio</h3></td>
                        </tr>";
            //Listar Promesa de servicio
            for ( $i = 0; $i < count( $promesas );
            $i++ ) {
                $tablas .= "<tr>
                                <td colspan='3' style='border:0.5px solid #858796;'>{$promesas[$i]}</td>
                            </tr>";
            }
            $tablas .= "</table>";
            //Objetivos
            $tablas .= "<table style='width:100%;'>
                            <tr>
                                <td colspan='8'><b>Instrucción</b>: <span>Transfiera las estrategias descritas y/o definidas en el cuadro de DEFINICION DE ESTRATEGIAS DE LA ORGANIZACIÓN a la celda que corresponda según la perspectiva del Balanced Scorecard.</span></td>
                            </tr>
                            <tr>
                                <td colspan='8' style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'><h3>Objetivos estratégicos y/o estrategias</h3></td>
                            </tr>
                            <tr>
                                <td colspan='2' style='width:25%;background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Perspectiva de talento humano</td>
                                <td colspan='2' style='width:25%;background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Perspectiva de procesos internos</td>
                                <td colspan='2' style='width:25%;background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Perspectiva de cliente</td>
                                <td colspan='2' style='width:25%;background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Perspectiva financiera</td>
                            </tr> ";
            //Listar objetivos
            for ( $i = 0; $i < count( $objetivos );
            $i++ ) {
                $pos = ( $i + 1 );
                $campo = $objetivos[$i];
                $tablas .= "<tr>
                                <td style='width:5%;border:0.5px solid #858796;'>O{$pos}PH</td>
                                <td style='border:0.5px solid #858796;'>{$campo[0]}</td>
                                <td style='width:5%;border:0.5px solid #858796;'>O{$pos}PP</td>
                                <td style='border:0.5px solid #858796;'>{$campo[1]}</td>
                                <td style='width:5%;border:0.5px solid #858796;'>O{$pos}PC</td>
                                <td style='border:0.5px solid #858796;'>{$campo[2]}</td>
                                <td style='width:5%;border:0.5px solid #858796;'>O{$pos}PF</td>
                                <td style='border:0.5px solid #858796;'>{$campo[3]}</td>
                            </tr>";
            }
            $tablas .= "</table>";
            $ehtml =  "<html> 
                        <body> 
                            {$cabecera}
                            {$tablas}
                            <div style='clear: both; margin: 0pt; padding: 0pt; '></div>
                        </body>                    
                  </html>";
            $mpdf = new \Mpdf\Mpdf( ['mode' => 'utf-8', 'format' => 'A4-L'] );
            $mpdf->WriteHTML( $ehtml );
            $pdfString = $mpdf->Output( '', 'S' );
            $pdfBase64 = base64_encode( $pdfString );
            $PDF = 'data:application/pdf;base64,' . $pdfBase64;
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se generó correctamente', 'reporte' => $PDF, 'nombre' => $razon_social, 'tipo' => 'Scorecard', 'ext' => '.pdf'] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function scorecard_excel() {
        try {
            Validacion::validar( ['respuesta' => 'obligatorio', 'objetivos' => 'obligatorio'], $_POST );
            $resultados = $_POST ['respuesta'];
            $objetivos = $_POST ['objetivos'];
            $razon_social = $_POST['razon_social'];
            $mision = ( $resultados[0][0] );
            $vision = ( $resultados[0][1] );
            $valores = ( $resultados[0][2] );
            $politicas = $resultados[1];
            $promesas = $resultados[2];
            $styleArray = [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
            ];
            $spreadsheet = new Spreadsheet();
            $spreadsheet->getActiveSheet()->getStyle( 'A1:R50' )->getAlignment()->setWrapText( true );
            $spreadsheet->getActiveSheet()->getStyle( "A1" )->getFont()->setSize( 19 )->setBold( true );
            $spreadsheet->getActiveSheet()->getStyle( 'A1' )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->mergeCells( "A1:R3" );
            //Logo dexcon
            $drawing = new \PhpOffice\PhpSpreadsheet\Worksheet\Drawing();
            $drawing->setPath( "../img/logo.png" );
            $drawing->setName( 'Logo' );
            $drawing->setCoordinates( 'B1' );
            $drawing->setWidthAndHeight( 100, 100 );
            $drawing->setWorksheet( $spreadsheet->setActiveSheetIndex( 0 ) );
            $sheet = $spreadsheet->getActiveSheet();
            //Titulo
            $sheet->setCellValue( 'A1', 'Cuadro de Mando Integral - Balanced Scorecard' );
            $spreadsheet->getActiveSheet()->getStyle( 'A1:R50' )->getAlignment()->setVertical( \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER );
            //Cuerpo parte 1
            $sheet->setCellValue( 'A4', 'Instrucción: Con base en todos los análisis anteriores defina la Misión, Visión, Valores y políticas que asumirá la compañía durante el horizonte estratégico.' );
            $spreadsheet->getActiveSheet()->getStyle( 'A4' )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->getStyle( "A4" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( 'E6E6E6' );
            $spreadsheet->getActiveSheet()->mergeCells( "A4:R5" );
            //Cuerpo parte 2
            $sheet->setCellValue( 'A7', 'Plan de futuro' );
            $spreadsheet->getActiveSheet()->getStyle( "A7" )->getFont()->setSize( 15 )->setBold( true );
            $spreadsheet->getActiveSheet()->mergeCells( "A7:R7" );
            //Cuerpo parte 3
            $spreadsheet->getActiveSheet()->getStyle( "A8:R8" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( '00000' );
            $spreadsheet->getActiveSheet()->getStyle( "A8:R8" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
            $spreadsheet->getActiveSheet()->getStyle( 'A8:R8' )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->getStyle( 'A9:M9' )->getAlignment()->setVertical( \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP );
            $spreadsheet->getActiveSheet()->getRowDimension( 9 )->setRowHeight( 130 );

            //Cuerpo parte 3.1 misión
            $sheet->setCellValue( 'A8', 'Misión' );
            $spreadsheet->getActiveSheet()->mergeCells( "A8:F8" );
            $sheet->setCellValue( 'A9', $mision );
            $spreadsheet->getActiveSheet()->mergeCells( "A9:F9" );
            //Cuerpo parte 3.2 visión
            $sheet->setCellValue( 'G8', 'Visión' );
            $spreadsheet->getActiveSheet()->mergeCells( "G8:L8" );
            $sheet->setCellValue( 'G9', $vision );
            $spreadsheet->getActiveSheet()->mergeCells( "G9:L9" );
            //Cuerpo parte 3.2 valores
            $sheet->setCellValue( 'M8', 'Valores' );
            $spreadsheet->getActiveSheet()->mergeCells( "M8:R8" );
            $sheet->setCellValue( 'M9', $valores );
            $spreadsheet->getActiveSheet()->mergeCells( "M9:R9" );
            //Cuerpo parte 4
            $sheet->setCellValue( 'A11', 'Politicas de gestión' );
            $spreadsheet->getActiveSheet()->getStyle( "A11" )->getFont()->setSize( 13 )->setBold( true );
            $spreadsheet->getActiveSheet()->getStyle( 'A11' )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->getStyle( "A11" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( '00000' );
            $spreadsheet->getActiveSheet()->getStyle( "A11" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
            $spreadsheet->getActiveSheet()->mergeCells( "A11:R11" );
            //Cuerpo parte 4.1 listar politicas
            $pos = 12;
            for ( $i = 0; $i < count( $politicas );
            $i++ ) {

                $sheet->setCellValue( "A{$pos}", $politicas[$i] );
                $spreadsheet->getActiveSheet()->mergeCells( "A{$pos}:R{$pos}" );
                $pos++;
            }
            //Cuerpo parte 5
            $sheet->setCellValue( "A{$pos}", 'Promesa de servicio' );
            $spreadsheet->getActiveSheet()->getStyle( "A{$pos}" )->getFont()->setSize( 13 )->setBold( true );
            $spreadsheet->getActiveSheet()->getStyle( "A{$pos}" )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->getStyle( "A{$pos}" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( '00000' );
            $spreadsheet->getActiveSheet()->getStyle( "A{$pos}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
            $spreadsheet->getActiveSheet()->mergeCells( "A{$pos}:R{$pos}" );
            //Cuerpo parte 5.1 Promesa de servicio
            $pos_prom = ( $pos + 1 );
            for ( $i = 0; $i < count( $promesas );
            $i++ ) {

                $sheet->setCellValue( "A{$pos_prom}", $promesas[$i] );
                $spreadsheet->getActiveSheet()->mergeCells( "A{$pos_prom}:R{$pos_prom}" );
                $pos_prom++;
            }
            //Cuerpo parte 6
            $alto = ( $pos_prom + 1 );
            $sheet->setCellValue( "A{$pos_prom}", 'Instrucción: Transfiera las estrategias descritas y/o definidas en el cuadro de DEFINICION DE ESTRATEGIAS DE LA ORGANIZACIÓN a la celda que corresponda según la perspectiva del Balanced Scorecard.' );
            $spreadsheet->getActiveSheet()->getStyle( "A{$pos_prom}" )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->getStyle( "A{$pos_prom}" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( 'E6E6E6' );
            $spreadsheet->getActiveSheet()->mergeCells( "A{$pos_prom}:R{$alto}" );
            //Cuerpo parte 6.1
            $alto_6_1 = ( $alto + 1 );
            $sheet->setCellValue( "A{$alto_6_1}", 'Objetivos estratégicos y/o estrategias' );
            $spreadsheet->getActiveSheet()->getStyle( "A{$alto_6_1}" )->getFont()->setSize( 13 )->setBold( true );
            $spreadsheet->getActiveSheet()->getStyle( "A{$alto_6_1}" )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->getStyle( "A{$alto_6_1}" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( '00000' );
            $spreadsheet->getActiveSheet()->getStyle( "A{$alto_6_1}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
            $spreadsheet->getActiveSheet()->mergeCells( "A{$alto_6_1}:R{$alto_6_1}" );
            //Cuerpo parte 6.2 Perspectiva de talento humano
            $alto_6_2 = ( $alto_6_1 + 1 );
            //Estilos 6.2
            $spreadsheet->getActiveSheet()->getStyle( "A{$alto_6_2}:R{$alto_6_2}" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( 'E6E6E6' );
            $spreadsheet->getActiveSheet()->getStyle( "A{$alto_6_2}:R{$alto_6_2}" )->getAlignment()->setHorizontal( 'center' );
            //Cabecera 6.2
            $sheet->setCellValue( "A{$alto_6_2}", 'Perspectiva de talento humano' );
            $spreadsheet->getActiveSheet()->mergeCells( "A{$alto_6_2}:E{$alto_6_2}" );
            $spreadsheet->getActiveSheet()->getStyle( "A{$alto_6_2}:E{$alto_6_2}" )->applyFromArray( $styleArray );
            //Cuerpo parte Perspectiva de procesos internos
            $sheet->setCellValue( "F{$alto_6_2}", 'Perspectiva de procesos internos' );
            $spreadsheet->getActiveSheet()->mergeCells( "F{$alto_6_2}:J{$alto_6_2}" );
            $spreadsheet->getActiveSheet()->getStyle( "F{$alto_6_2}:J{$alto_6_2}" )->applyFromArray( $styleArray );
            //Cuerpo parte Perspectiva de cliente
            $sheet->setCellValue( "K{$alto_6_2}", 'Perspectiva de cliente' );
            $spreadsheet->getActiveSheet()->mergeCells( "K{$alto_6_2}:N{$alto_6_2}" );
            $spreadsheet->getActiveSheet()->getStyle( "K{$alto_6_2}:N{$alto_6_2}" )->applyFromArray( $styleArray );
            //Cuerpo parte Perspectiva financiera
            $sheet->setCellValue( "O{$alto_6_2}", 'Perspectiva financiera' );
            $spreadsheet->getActiveSheet()->mergeCells( "O{$alto_6_2}:R{$alto_6_2}" );
            $spreadsheet->getActiveSheet()->getStyle( "O{$alto_6_2}:R{$alto_6_2}" )->applyFromArray( $styleArray );
            //Listar objetivos
            $pos_6_3 = ( $alto_6_2 + 1 );
            for ( $i = 0; $i < count( $objetivos );
            $i++ ) {
                $pos_i = ( $i + 1 );
                $campo = $objetivos[$i];
                //Indices
                $sheet->setCellValue( "A{$pos_6_3}", "O{$pos_i}PH" );
                $sheet->setCellValue( "F{$pos_6_3}", "O{$pos_i}PP" );
                $sheet->setCellValue( "K{$pos_6_3}", "O{$pos_i}PC" );
                $sheet->setCellValue( "O{$pos_6_3}", "O{$pos_i}PF" );
                //Datos
                $sheet->setCellValue( "B{$pos_6_3}", $campo[0] );
                $spreadsheet->getActiveSheet()->mergeCells( "B{$pos_6_3}:E{$pos_6_3}" );
                $sheet->setCellValue( "G{$pos_6_3}", $campo[1] );
                $spreadsheet->getActiveSheet()->mergeCells( "G{$pos_6_3}:J{$pos_6_3}" );
                $sheet->setCellValue( "L{$pos_6_3}", $campo[2] );
                $spreadsheet->getActiveSheet()->mergeCells( "L{$pos_6_3}:N{$pos_6_3}" );
                $sheet->setCellValue( "P{$pos_6_3}", $campo[3] );
                $spreadsheet->getActiveSheet()->mergeCells( "P{$pos_6_3}:R{$pos_6_3}" );
                //Estilos
                $spreadsheet->getActiveSheet()->getStyle( "A{$pos_6_3}" )->applyFromArray( $styleArray );
                $spreadsheet->getActiveSheet()->getStyle( "F{$pos_6_3}" )->applyFromArray( $styleArray );
                $spreadsheet->getActiveSheet()->getStyle( "K{$pos_6_3}" )->applyFromArray( $styleArray );
                $spreadsheet->getActiveSheet()->getStyle( "O{$pos_6_3}" )->applyFromArray( $styleArray );
                $spreadsheet->getActiveSheet()->getStyle( "B{$pos_6_3}:E{$pos_6_3}" )->applyFromArray( $styleArray );
                $spreadsheet->getActiveSheet()->getStyle( "G{$pos_6_3}:J{$pos_6_3}" )->applyFromArray( $styleArray );
                $spreadsheet->getActiveSheet()->getStyle( "L{$pos_6_3}:N{$pos_6_3}" )->applyFromArray( $styleArray );
                $spreadsheet->getActiveSheet()->getStyle( "P{$pos_6_3}:R{$pos_6_3}" )->applyFromArray( $styleArray );
                $spreadsheet->getActiveSheet()->getStyle( "B{$pos_6_3}" )->getAlignment()->setVertical( \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP );
                $spreadsheet->getActiveSheet()->getStyle( "G{$pos_6_3}" )->getAlignment()->setVertical( \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP );
                $spreadsheet->getActiveSheet()->getStyle( "L{$pos_6_3}" )->getAlignment()->setVertical( \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP );
                $spreadsheet->getActiveSheet()->getStyle( "P{$pos_6_3}" )->getAlignment()->setVertical( \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_TOP );
                $spreadsheet->getActiveSheet()->getRowDimension( $pos_6_3 )->setRowHeight( 30 );
                $pos_6_3++;
            }
            $writer = new Xlsx( $spreadsheet );
            ob_start();
            $writer->save( 'php://output' );
            $contenido = ob_get_clean();
            $excelBase64 = base64_encode( $contenido );
            $excel = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' . $excelBase64;
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se generó correctamente', 'reporte' => $excel, 'nombre' => $razon_social, 'tipo' => 'Scorecard', 'ext' => '.xlsx'] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function indicadores_pdf() {
        try {
            Validacion::validar( ['resultado' => 'obligatorio', 'anio' => 'obligatorio', 'datos_anios' => 'obligatorio'], $_POST );
            $resultado = $_POST ['resultado'];
            $datos_anios = $_POST ['datos_anios'];
            $anio = $_POST ['anio'];
            $razon_social = $_POST['razon_social'];
            $promedio = $_POST['promedio'];
            $meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", "Promedio"];
            $header = '<head> 
                      <style>
                            h1 { font-family: chronicle;font-weight: normal; } 
                            h4 { font-family: chronicle; font-size: 10pt; text-align:center; margin-top: 0; margin-bottom: 0; }
                            h6 { font-family: chronicle; font-size: 6pt; font-weight: 100; text-align:center; margin-top: 0; margin-bottom: 0;}
                            table, td{border-collapse: collapse; color: black !important; text-align: center;font-size:12px; }
                            body {font-family: opensans;}
                      </style> 
                   </head>';
            // Cabecera del documento
            $cabecera = "<div style='margin-bottom:10px;'> 
                            <div style='float: left; width: 10%; text-align:left;' > 
                                <img src='../img/logo.png'>
                            </div> 
                            <div style='float:left; vertical-align: top; padding-left: 18px;'>
                                <h1 style='font-size: 20pt;margin-left:70px;'>Tablero de indicadores {$anio}</h1> 
                            </div>
                        </div>";
            //Cabecera de la tabla
            $tablas = "<tbody>
                            <tr>
                                <td colspan='7' style='width:1050px;'></td>
                                <td colspan='3' style='width:550px;background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Meta</td>
                                <td colspan='5' style='width:1050px;'></td>
                                <td colspan='13' style='width:1050px;background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Año {$anio}</td>
                            </tr>
                            <tr>
                                <td style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Direccionamiento estratégico</td>
                                <td style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Directriz de política</td>
                                <td style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Objetivo de gestión</td>
                                <td style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Que hacer para cumplirlo</td>
                                <td style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Proceso</td>
                                <td style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Indicador</td>
                                <td style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Fórmula</td>
                                <td style='background-color: #86F200;border:0.5px solid #858796;text-align:center'>Sobresaliente</td>
                                <td style='background-color: #fdd300;border:0.5px solid #858796;text-align:center'>Normal (Meta)</td>
                                <td style='background-color: #C00000; color: white;border:0.5px solid #858796;text-align:center'>Deficiente</td>
                                <td style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Positivo si</td>
                                <td style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Frecuencia</td>
                                <td style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Tipo de indicador</td>
                                <td style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Fuente de los datos</td>
                                <td style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'>Responsable</td>";
            for ( $i = 0; $i < 13; $i++ ) {
                $tablas .= "<td style='background-color: black; color: white;border:0.5px solid #858796;text-align:center'>{$meses[$i]}</td>";
            }
            $tablas .= "</tr>";
            //Datos
            $data = $datos_anios[1];
            $tablas .= "<tr>";
            for ( $i = 1; $i <= count( $data );
            $i++ ) {
                $campos = $data[$i];
                //Campo 1
                if ( $i == 1 ) {
                    $tablas .= "<td style='vertical-align: top;'><table style='width:100%;'>";
                    for ( $a = 0; $a < count( $campos );
                    $a++ ) {
                        $dato = ( $campos[$a] != "" ) ? $campos[$a] : "-";
                        $tablas .= "<tr>
                                        <td style='width:50%;border:0.5px solid #858796;'>{$dato[0]}</td>
                                        <td style='width:50%;border:0.5px solid #858796;'>{$dato[1]}</td>
                                    </tr>";
                    }
                    $tablas .= "</table></td>";
                }
                //Campo 2 al 7
                if ( $i >= 2 && $i <= 7 ) {
                    $tablas .= "<td style='vertical-align: top;'><table style='width:100%;'>";
                    for ( $a = 0; $a < count( $campos );
                    $a++ ) {
                        $dato = ( $campos[$a] != "" ) ? $campos[$a] : "-";
                        $tablas .= "<tr>
                                        <td style='border:0.5px solid #858796;'>{$dato}</td>
                                    </tr>";
                    }
                    $tablas .= "</table></td>";
                }
                //Campo 8
                if ( $i == 8 ) {
                    for ( $c = 0; $c < 3; $c++ ) {
                        $tablas .= "<td style='vertical-align: top;'><table style='width:100%;'>";
                        for ( $a = 0; $a < count( $campos );
                        $a++ ) {
                            $dato = $campos[$a];
                            $dat = ( $dato[$c] != "" ) ? $dato[$c] : "-";
                            $color = "";
                            $texto_color = "";
                            if ( $c == 2 ) {
                                $color = "#C00000";
                                $texto_color = "white";
                            }
                            if ( $c == 1 ) {
                                $color = "#fdd300";
                                $texto_color = "black";
                            }
                            if ( $c == 0 ) {
                                $color = "#86F200";
                                $texto_color = "black";
                            }
                            $tablas .= "<tr>
                                            <td style='background-color:{$color};color:{$texto_color};border:0.5px solid #858796;'>{$dat}</td>
                                        </tr>";
                        }
                        $tablas .= "</table></td>";
                    }
                }
                //Campo 9 al 13
                if ( $i >= 9 && $i <= 13 ) {
                    $tablas .= "<td style='vertical-align: top;'><table style='width:100%;'>";
                    for ( $a = 0; $a < count( $campos );
                    $a++ ) {
                        $dato = ( $campos[$a] != "" ) ? $campos[$a] : "-";
                        $tablas .= "<tr>
                                        <td style='border:0.5px solid #858796;'>{$dato}</td>
                                    </tr>";
                    }
                    $tablas .= "</table></td>";
                }
                //Campo >13
                if ( $i > 13 ) {
                    for ( $c = 0; $c < 12; $c++ ) {
                        $tablas .= "<td style='vertical-align: top;'><table style='width:100%;'>";
                        for ( $a = 0; $a < count( $campos );
                        $a++ ) {
                            $dato = $campos[$a];
                            $dat = ( $dato[$c] != "" ) ? "{$dato[$c]}%" : "-";
                            $tablas .= "<tr>
                                            <td style='border:0.5px solid #858796;text-align:center'>{$dat}</td>
                                        </tr>";
                        }
                        $tablas .= "</table></td>";
                    }
                }
            }
            //Promedios
            $prom = explode( "|", $promedio );
            $tablas .= "<td style='vertical-align: top;'><table style='width:100%;'>";
            for ( $a = 0; $a < count( $prom );
            $a++ ) {
                $tablas .= "<tr>
                                <td style='border:0.5px solid #858796;text-align:center'>{$prom[$a]}</td>
                            </tr>";
            }
            $tablas .= "</table></td>";
            $tablas .= "</tr>";
            //Pie con resultados
            $tablas .= "<tr><td colspan='15'></td>";
            $res = explode( "|", $resultado );
            for ( $i = 0; $i < 13; $i++ ) {
                $color = "#C00000";
                $texto_color = "white";
                $dato = floatval( $res[$i] );
                if ( $dato >= 33 ) {
                    $color = "#fdd300";
                    $texto_color = "black";
                }
                if ( $dato >= 67 ) {
                    $color = "#86F200";
                    $texto_color = "black";
                }
                $tablas .= "<td style='background-color:{$color};color:{$texto_color};border:0.5px solid #858796;text-align:center'>{$dato}%</td>";
            }
            //Total final
            $total = floatval( $res[13] );
            $color_total = "#C00000";

            $texto_total = "white";
            if ( $total >= 33 ) {
                $color_total = "#fdd300";
                $texto_total = "black";
            }
            if ( $total >= 67 ) {
                $color_total = "#86F200";
                $texto_total = "black";
            }
            $tablas .= "</tr>
                        <tr>
                            <td colspan='25'></td>
                            <td colspan='3' style='background-color:{$color_total};color:{$texto_total};border:0.5px solid #858796;text-align:center'>{$total}%</td>
                        </tr>
                    </tbody>>";

            $ehtml =  "<html> 
                        <body> 
                            {$cabecera}
                            <table style='width:100%;'>
                                {$tablas}
                            </table>
                            <div style='clear: both; margin: 0pt; padding: 0pt; '></div>
                        </body>                    
                  </html>";
            //El problema es el colspan
            $mpdf = new \Mpdf\Mpdf( ['mode' => 'utf-8', 'format' => 'A4-L'] );
            $mpdf->WriteHTML( $ehtml );
            $pdfString = $mpdf->Output( '', 'S' );
            $pdfBase64 = base64_encode( $pdfString );
            $PDF = 'data:application/pdf;base64,' . $pdfBase64;
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se generó correctamente', 'reporte' => $PDF, 'nombre' => $razon_social, 'tipo' => 'TableroIndicadores', 'ext' => '.pdf', 'anio' => $anio] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function indicadores_excel() {
        try {
            Validacion::validar( ['resultado' => 'obligatorio', 'datos_anios' => 'obligatorio', 'anio' => 'obligatorio'], $_POST );
            $resultado = $_POST ['resultado'];
            $datos_anios = $_POST ['datos_anios'];
            $anio = $_POST ['anio'];
            $razon_social = $_POST['razon_social'];
            $promedio = $_POST['promedio'];
            $meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre", "Promedio"];
            $styleArray = [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
            ];
            $spreadsheet = new Spreadsheet();
            $spreadsheet->getActiveSheet()->getStyle( 'A1:R50' )->getAlignment()->setWrapText( true );
            $spreadsheet->getActiveSheet()->getStyle( "A1" )->getFont()->setSize( 19 )->setBold( true );
            $spreadsheet->getActiveSheet()->getStyle( 'A1' )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->mergeCells( "A1:R3" );
            $spreadsheet->getActiveSheet()->getStyle( 'A1:H50' )->getAlignment()->setWrapText( true );
            //Estilo de la parte 1
            $spreadsheet->getActiveSheet()->getStyle( "I5:AC5" )->getFont()->setBold( true );
            $spreadsheet->getActiveSheet()->getStyle( 'I5:AC5' )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->getStyle( "I5:AC5" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( '00000' );
            $spreadsheet->getActiveSheet()->getStyle( "I5:AC5" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
            //Estilo de la parte 2
            $spreadsheet->getActiveSheet()->getStyle( "A6:AC6" )->getFont()->setBold( true );
            $spreadsheet->getActiveSheet()->getStyle( 'A6:AC6' )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->getStyle( "A6:AC6" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( '00000' );
            $spreadsheet->getActiveSheet()->getStyle( "A6:AC6" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
            //Celdas espacios
            $spreadsheet->getActiveSheet()->getColumnDimension( 'A' )->setWidth( 50, 'pt' );
            $spreadsheet->getActiveSheet()->getColumnDimension( 'b' )->setWidth( 50, 'pt' );
            for ( $i = "C"; $i <= "P"; $i++ ) {
                $spreadsheet->getActiveSheet()->getColumnDimension( "{$i}" )->setAutoSize( true );
                
            }
            //Celdas meses
            $x = "P";
            for ( $i = 0; $i <= 13; $i++ ) {
                $spreadsheet->getActiveSheet()->getColumnDimension( "{$x}" )->setWidth( 20, 'pt' );
                $x++;
            }
            //Logo dexcon
            $drawing = new \PhpOffice\PhpSpreadsheet\Worksheet\Drawing();
            $drawing->setPath( "../img/logo.png" );
            $drawing->setName( 'Logo' );
            $drawing->setCoordinates( 'B1' );
            $drawing->setWidthAndHeight( 100, 100 );
            $drawing->setWorksheet( $spreadsheet->setActiveSheetIndex( 0 ) );
            $sheet = $spreadsheet->getActiveSheet();
            //Titulo
            $sheet->setCellValue( 'A1', "Tablero de indicadores {$anio}" );
            $spreadsheet->getActiveSheet()->getStyle( 'A1:W50' )->getAlignment()->setVertical( \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER );
            //Cabecera parte 1
            $sheet->setCellValue( 'I5', 'Meta' );
            $spreadsheet->getActiveSheet()->mergeCells( "I5:K5" );
            //Cabecera parte 1.1
            $sheet->setCellValue( 'Q5', "Año {$anio}" );
            $spreadsheet->getActiveSheet()->mergeCells( "Q5:AC5" );
            //Cabecera parte 2
            $sheet->setCellValue( 'A6', 'Direccionamiento estratégico' );
            $spreadsheet->getActiveSheet()->mergeCells( "A6:B6" );
            //Cabecera parte 2.1
            $sheet->setCellValue( 'C6', 'Directriz de política' );
            //Cabecera parte 2.2
            $sheet->setCellValue( 'D6', 'Objetivo de gestión' );
            //Cabecera parte 2.3
            $sheet->setCellValue( 'E6', 'Que hacer para cumplirlo' );
            //Cabecera parte 2.4
            $sheet->setCellValue( 'F6', 'Proceso' );
            //Cabecera parte 2.5
            $sheet->setCellValue( 'G6', 'Indicador' );
            //Cabecera parte 2.6
            $sheet->setCellValue( 'H6', 'Fórmula' );
            //Cabecera parte 2.7
            $sheet->setCellValue( 'I6', 'Sobresaliente' );
            $spreadsheet->getActiveSheet()->getStyle( "I6" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( '86F200' );
            $spreadsheet->getActiveSheet()->getStyle( "I6" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_BLACK );
            $sheet->setCellValue( 'J6', 'Normal (Meta)' );
            $spreadsheet->getActiveSheet()->getStyle( "J6" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( 'fdd300' );
            $spreadsheet->getActiveSheet()->getStyle( "J6" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_BLACK );
            $sheet->setCellValue( 'K6', 'Deficiente' );
            $spreadsheet->getActiveSheet()->getStyle( "K6" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( 'C00000' );
            //Cabecera parte 2.8
            $sheet->setCellValue( 'L6', 'Positivo si' );
            //Cabecera parte 2.9
            $sheet->setCellValue( 'M6', 'Frecuencia' );
            //Cabecera parte 2.10
            $sheet->setCellValue( 'N6', 'Tipo de indicador' );
            //Cabecera parte 2.11
            $sheet->setCellValue( 'O6', 'Fuente de los datos' );
            //Cabecera parte 2.12
            $sheet->setCellValue( 'P6', 'Responsable' );
            //Cabecera parte 2.13 meses
            $mes = "Q";
            for ( $i = 0; $i < 13; $i++ ) {
                $sheet->setCellValue( "{$mes}6", "{$meses[$i]}" );
                $mes++;
            }
            //Cuerpo parte 1
            $data = $datos_anios[1];
            $campo = 7;
            $letraC = "C";
            $letraH = "I";
            $letraK = "Q";
            for ( $i = 1; $i <= count( $data );
            $i++ ) {
                $campos = $data[$i];
                //Campo A y B
                if ( $i == 1 ) {
                    $cmp = 7;
                    for ( $a = 0; $a < count( $campos );
                    $a++ ) {
                        $dato = $campos[$a];
                        $sheet->setCellValue( "A{$cmp}", "{$dato[0]}" );
                        $sheet->setCellValue( "B{$cmp}", "{$dato[1]}" );
                        $spreadsheet->getActiveSheet()->getStyle( "A{$cmp}" )->applyFromArray( $styleArray );
                        $spreadsheet->getActiveSheet()->getStyle( "B{$cmp}" )->applyFromArray( $styleArray );
                        $cmp++;

                    }
                }
                //Campo 2 al 7
                if ( $i >= 2 && $i <= 7 ) {
                    $cmp = 7;
                    for ( $a = 0; $a < count( $campos );
                    $a++ ) {
                        $dato = $campos[$a];
                        $sheet->setCellValue( "{$letraC}{$cmp}", "{$dato}" );
                        $spreadsheet->getActiveSheet()->getStyle( "{$letraC}{$cmp}" )->applyFromArray( $styleArray );
                        $cmp++;
                    }
                    $letraC++;
                }
                //Campo 8
                if ( $i == 8 ) {
                    for ( $c = 0; $c < 3; $c++ ) {
                        $cmp = 7;
                        for ( $a = 0; $a < count( $campos );
                        $a++ ) {
                            $dato = $campos[$a];
                            $dat = $dato[$c];
                            $color = "";
                            $texto_color = "";
                            if ( $c == 2 ) {
                                $color = "C00000";
                                $spreadsheet->getActiveSheet()->getStyle( "{$letraH}{$cmp}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
                            }
                            if ( $c == 1 ) {
                                $color = "fdd300";
                                $spreadsheet->getActiveSheet()->getStyle( "{$letraH}{$cmp}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_BLACK );
                            }
                            if ( $c == 0 ) {
                                $color = "86F200";
                                $spreadsheet->getActiveSheet()->getStyle( "{$letraH}{$cmp}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_BLACK );
                            }
                            $sheet->setCellValue( "{$letraH}{$cmp}", "{$dat}" );
                            $spreadsheet->getActiveSheet()->getStyle( "{$letraH}{$cmp}" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( "{$color}" );
                            $spreadsheet->getActiveSheet()->getStyle( "{$letraH}{$cmp}" )->applyFromArray( $styleArray );
                            $cmp++;
                        }
                        $letraH++;
                    }
                }
                //Campo 9 al 13
                if ( $i >= 9 && $i <= 13 ) { 
                    $cmp = 7;
                    for ( $a = 0; $a < count( $campos );
                    $a++ ) {
                        $dato = $campos[$a];
                        $sheet->setCellValue( "{$letraH}{$cmp}", "{$dato}" );
                        $spreadsheet->getActiveSheet()->getStyle( "{$letraH}{$cmp}" )->applyFromArray( $styleArray );
                        $cmp++;
                    }
                    $letraH++;
                } 
                //Campo > 13
                if ( $i > 13 ) {
                    for ( $c = 0; $c < 12; $c++ ) {
                        $cmp = 7;
                        for ( $a = 0; $a < count( $campos );
                        $a++ ) {
                            $dato = $campos[$a];
                            $dat = ( $dato[$c] != "" ) ? "{$dato[$c]}%" : "0%";
                            $sheet->setCellValue( "{$letraK}{$cmp}", "{$dat}" );
                            $spreadsheet->getActiveSheet()->getStyle( "{$letraK}{$cmp}" )->getAlignment()->setHorizontal( 'center' );
                            $spreadsheet->getActiveSheet()->getStyle( "{$letraK}{$cmp}" )->applyFromArray( $styleArray );
                            $cmp++;
                        }
                        $letraK++;
                    }
                }
            }
            //Promedios
            $cmp = 7;
            $letraK = "Q";
            $prom = explode( "|", $promedio );
            for ( $a = 0; $a < count( $prom );
            $a++ ) {
                $sheet->setCellValue( "AC{$cmp}", "{$prom[$a]}" );
                $spreadsheet->getActiveSheet()->getStyle( "AC{$cmp}" )->getAlignment()->setHorizontal( 'center' );
                $spreadsheet->getActiveSheet()->getStyle( "AC{$cmp}" )->applyFromArray( $styleArray );
                $cmp++;
            }
            //Resultados
            $res = explode( "|", $resultado );
            for ( $i = 0; $i < 13; $i++ ) {
                $color = "C00000";
                $spreadsheet->getActiveSheet()->getStyle( "{$letraK}{$cmp}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
                $dato = floatval( $res[$i] );
                if ( $dato >= 33 ) {
                    $color = "fdd300";
                    $spreadsheet->getActiveSheet()->getStyle( "{$letraK}{$cmp}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_BLACK );
                }
                if ( $dato >= 67 ) {
                    $color = "86F200";
                    $spreadsheet->getActiveSheet()->getStyle( "{$letraK}{$cmp}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_BLACK );
                }
                $sheet->setCellValue( "{$letraK}{$cmp}", "{$dato}%" );
                $spreadsheet->getActiveSheet()->getStyle( "{$letraK}{$cmp}" )->getAlignment()->setHorizontal( 'center' );
                $spreadsheet->getActiveSheet()->getStyle( "{$letraK}{$cmp}" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( "{$color}" );
                $spreadsheet->getActiveSheet()->getStyle( "{$letraK}{$cmp}" )->applyFromArray( $styleArray );
                $letraK++;
            }
            //Total final
            $total = floatval( $res[13] );
            $cmp_total = ( $cmp + 1 );
            $color_total = "C00000";
            $spreadsheet->getActiveSheet()->getStyle( "AA{$cmp_total}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
            if ( $total >= 33 ) {
                $color_total = "fdd300";
                $spreadsheet->getActiveSheet()->getStyle( "AA{$cmp_total}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_BLACK );
            }
            if ( $total >= 67 ) {
                $color_total = "86F200";
                $spreadsheet->getActiveSheet()->getStyle( "AA{$cmp_total}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_BLACK );
            }
            $sheet->setCellValue( "AA{$cmp_total}", "{$total}%" );
            $spreadsheet->getActiveSheet()->getStyle( "AA{$cmp_total}" )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->getStyle( "AA{$cmp_total}" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( "{$color_total}" );
            $spreadsheet->getActiveSheet()->mergeCells( "AA{$cmp_total}:AC{$cmp_total}" );
            $spreadsheet->getActiveSheet()->getStyle( "AA{$cmp_total}:AC{$cmp_total}" )->applyFromArray( $styleArray );
            //Armar reporte
            $writer = new Xlsx( $spreadsheet );
            ob_start();
            $writer->save( 'php://output' );
            $contenido = ob_get_clean();
            $excelBase64 = base64_encode( $contenido );
            $excel = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' . $excelBase64;
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se generó correctamente', 'reporte' => $excel, 'nombre' => $razon_social, 'tipo' => 'TableroIndicadores', 'ext' => '.xlsx', 'anio' => $anio] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function dofa_pdf() {
        try {
            Validacion::validar( ['respuesta' => 'obligatorio'], $_POST );
            $resultados = $_POST ['respuesta'];
            $razon_social = $_POST['razon_social'];
            $header = '<head> 
                      <style>
                            h1 { font-family: chronicle;font-weight: normal; } 
                            h4 { font-family: chronicle; font-size: 10pt; text-align:center; margin-top: 0; margin-bottom: 0; }
                            h6 { font-family: chronicle; font-size: 6pt; font-weight: 100; text-align:center; margin-top: 0; margin-bottom: 0;}
                            table, td{border-collapse: collapse; color: black !important; text-align: center;font-size:12px; }
                            body {font-family: opensans;}
                      </style> 
                   </head>';
            // Cabecera del documento
            $cabecera = "<div style='margin-bottom:7px;'> 
                            <div style='float: left; width: 10%; text-align:left;' > 
                                <img src='../img/logo.png'>
                            </div> 
                            <div style='float:left; vertical-align: top; padding-left: 18px;'>
                                <h1 style='font-size: 20pt;margin-left:70px;'>DOFA: hoja de trabajo</h1> 
                            </div>
                        </div>";
            $titulos = [
                1 => [
                    "O" => "Oportunidades" ,
                    "A" => "Amenazas"
                ],
                2 => [
                    "F" => "Fortaleza",
                    "FO" => "Estrategias FO ( Ataque )",
                    "FA" => "Estrategias FA ( Defensivas )"
                ],
                3 => [
                    "D" => "Debilidades",
                    "DO" => "Estrategias DO ( Refuerzo ó mejora )",
                    "DA" => "Estrategias DA ( Mejora/ ó retirata )"
                ]
            ];
            //Cuerpo del documento
            $tablas = "<table style='width:100%;'>";
            foreach ( $resultados as $key => $value ) {
                $dato = $value;
                $total = count( $titulos[$key] );
                $tablas .= "<tr>";
                $tablas .= ( $key == 1 ) ? "<td colspan='2'></td>" : "";
                foreach ( $titulos[$key] as $indice => $valor ) {
                    $tablas .=
                    "<td style='width:10px;background-color:black; color:white;border: 0.5px solid #858796;'>{$indice}</td>
                    <td style='text-align:center;width:33.33%;background-color:black; color:white;border: 0.5px solid #858796;'>{$valor}</td>";
                }
                $tablas .= "<tr>";
                $a = 1;
                for ( $i = 0; $i < count( $dato );
                $i++ ) {
                    $datos = $dato[$i];
                    $tablas .= "<tr>";
                    $tablas .= ( $key == 1 ) ? "<td colspan='2'></td>" : "";
                    $tablas .= "
                        <td style='border: 0.5px solid #858796;'>{$a}</td>
                        <td style='border: 0.5px solid #858796;'>{$datos[0]}</td>
                        <td style='border: 0.5px solid #858796;'>{$a}</td>
                        <td style='border: 0.5px solid #858796;'>{$datos[1]}</td>";
                    $tablas .= ( $key > 1 ) ? "<td style='border: 0.5px solid #858796;'>{$a}</td>
                                              <td style='border: 0.5px solid #858796;'>{$datos[2]}</td>" : "";
                    $tablas .= "</tr>";
                    $a++;
                }
            }
            $tablas .= "</table>";
            $ehtml =  "<html> 
                        <body> 
                            {$cabecera}
                            {$tablas}
                            <div style='clear: both; margin: 0pt; padding: 0pt; '></div>
                        </body>                    
                  </html>";
            $mpdf = new \Mpdf\Mpdf( ['mode' => 'utf-8', 'format' => 'A4-L'] );
            $mpdf->WriteHTML( $ehtml );
            $pdfString = $mpdf->Output( '', 'S' );
            $pdfBase64 = base64_encode( $pdfString );
            $PDF = 'data:application/pdf;base64,' . $pdfBase64;
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se generó correctamente', 'reporte' => $PDF, 'nombre' => $razon_social, 'tipo' => 'DOFA', 'ext' => '.pdf'] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }

    public function dofa_excel() {
        try {
            Validacion::validar( ['respuesta' => 'obligatorio'], $_POST );
            $resultados = $_POST ['respuesta'];
            $razon_social = $_POST['razon_social'];
            $styleArray = [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    ],
                ],
            ];
            $spreadsheet = new Spreadsheet();
            $spreadsheet->getActiveSheet()->getStyle( 'A1:R50' )->getAlignment()->setWrapText( true );
            $spreadsheet->getActiveSheet()->getStyle( "A1" )->getFont()->setSize( 19 )->setBold( true );
            $spreadsheet->getActiveSheet()->getStyle( 'A1' )->getAlignment()->setHorizontal( 'center' );
            $spreadsheet->getActiveSheet()->mergeCells( "A1:F3" );
            //Logo dexcon
            $drawing = new \PhpOffice\PhpSpreadsheet\Worksheet\Drawing();
            $drawing->setPath( "../img/logo.png" );
            $drawing->setName( 'Logo' );
            $drawing->setCoordinates( 'B1' );
            $drawing->setWidthAndHeight( 100, 100 );
            $drawing->setWorksheet( $spreadsheet->setActiveSheetIndex( 0 ) );
            $sheet = $spreadsheet->getActiveSheet();
            //Titulo
            $sheet->setCellValue( 'A1', 'DOFA: hoja de trabajo' );
            $spreadsheet->getActiveSheet()->getStyle( 'A1:R50' )->getAlignment()->setVertical( \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER );
            //Celdas espacios
            $spreadsheet->getActiveSheet()->getColumnDimension( 'A' )->setWidth( 5, 'pt' );
            $spreadsheet->getActiveSheet()->getColumnDimension( 'B' )->setWidth( 55, 'pt' );
            $spreadsheet->getActiveSheet()->getColumnDimension( 'C' )->setWidth( 5, 'pt' );
            $spreadsheet->getActiveSheet()->getColumnDimension( 'D' )->setWidth( 55, 'pt' );
            $spreadsheet->getActiveSheet()->getColumnDimension( 'E' )->setWidth( 5, 'pt' );
            $spreadsheet->getActiveSheet()->getColumnDimension( 'F' )->setWidth( 55, 'pt' );
            //Titulo #1
            $sheet->setCellValue( 'C5', 'O' );
            $sheet->setCellValue( 'D5', 'Oportunidades' );
            $sheet->setCellValue( 'E5', 'A' );
            $sheet->setCellValue( 'F5', 'Amenazas' );
            $spreadsheet->getActiveSheet()->getStyle( "C5:F5" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( '00000' );
            $spreadsheet->getActiveSheet()->getStyle( "C5:F5" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
            $spreadsheet->getActiveSheet()->getStyle( 'C5:F5' )->getAlignment()->setHorizontal( 'center' );
            //Cuerpo #1
            $dato1 = $resultados[1];
            $fila1 = 6;
            $a = 1;
            for ( $i = 0; $i < count( $dato1 );
            $i++ ) {
                $datos = $dato1[$i];
                $sheet->setCellValue( "C{$fila1}", "{$a}" );
                $sheet->setCellValue( "D{$fila1}", "{$datos[0]}" );
                $sheet->setCellValue( "E{$fila1}", "{$a}" );
                $sheet->setCellValue( "F{$fila1}", "{$datos[1]}" );
                $spreadsheet->getActiveSheet()->getStyle( "C{$fila1}:F{$fila1}" )->applyFromArray( $styleArray );
                $fila1++;
                $a++;
            }
            //Titulo #2
            $sheet->setCellValue( "A{$fila1}", "F" );
            $sheet->setCellValue( "B{$fila1}", "Fortalezas" );
            $sheet->setCellValue( "C{$fila1}", "FO" );
            $sheet->setCellValue( "D{$fila1}", "Estrategias FO ( Ataque )" );
            $sheet->setCellValue( "E{$fila1}", "FA" );
            $sheet->setCellValue( "F{$fila1}", "Estrategias FA ( Defensivas )" );
            $spreadsheet->getActiveSheet()->getStyle( "A{$fila1}:F{$fila1}" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( "00000" );
            $spreadsheet->getActiveSheet()->getStyle( "A{$fila1}:F{$fila1}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
            $spreadsheet->getActiveSheet()->getStyle( "A{$fila1}:F{$fila1}" )->getAlignment()->setHorizontal( 'center' );
            //Cuerpo #2
            $dato2 = $resultados[2];
            $fila2 = ( $fila1 + 1 );
            $a = 1;
            for ( $i = 0; $i < count( $dato2 );
            $i++ ) {
                $datos = $dato2[$i];
                $sheet->setCellValue( "A{$fila2}", "{$a}" );
                $sheet->setCellValue( "B{$fila2}", "{$datos[0]}" );
                $sheet->setCellValue( "C{$fila2}", "{$a}" );
                $sheet->setCellValue( "D{$fila2}", "{$datos[1]}" );
                $sheet->setCellValue( "E{$fila2}", "{$a}" );
                $sheet->setCellValue( "F{$fila2}", "{$datos[2]}" );
                $spreadsheet->getActiveSheet()->getStyle( "A{$fila2}:F{$fila2}" )->applyFromArray( $styleArray );
                $fila2++;
                $a++;
            }
            //Titulo #3
            $sheet->setCellValue( "A{$fila2}", "D" );
            $sheet->setCellValue( "B{$fila2}", "Debilidades" );
            $sheet->setCellValue( "C{$fila2}", "DO" );
            $sheet->setCellValue( "D{$fila2}", "Estrategias DO ( Refuerzo ó mejora )" );
            $sheet->setCellValue( "E{$fila2}", "DA" );
            $sheet->setCellValue( "F{$fila2}", "Estrategias DA ( Mejora/ ó retirata )" );
            $spreadsheet->getActiveSheet()->getStyle( "A{$fila2}:F{$fila2}" )->getFill()->setFillType( \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID )->getStartColor()->setARGB( "00000" );
            $spreadsheet->getActiveSheet()->getStyle( "A{$fila2}:F{$fila2}" )->getFont()->getColor()->setARGB( \PhpOffice\PhpSpreadsheet\Style\Color::COLOR_WHITE );
            $spreadsheet->getActiveSheet()->getStyle( "A{$fila2}:F{$fila2}" )->getAlignment()->setHorizontal( 'center' );
            //Cuerpo #3
            $dato3 = $resultados[3];
            $fila3 = ( $fila2 + 1 );
            $a = 1;
            for ( $i = 0; $i < count( $dato3 );
            $i++ ) {
                $datos = $dato3[$i];
                $sheet->setCellValue( "A{$fila3}", "{$a}" );
                $sheet->setCellValue( "B{$fila3}", "{$datos[0]}" );
                $sheet->setCellValue( "C{$fila3}", "{$a}" );
                $sheet->setCellValue( "D{$fila3}", "{$datos[1]}" );
                $sheet->setCellValue( "E{$fila3}", "{$a}" );
                $sheet->setCellValue( "F{$fila3}", "{$datos[2]}" );
                $spreadsheet->getActiveSheet()->getStyle( "A{$fila3}:F{$fila3}" )->applyFromArray( $styleArray );
                $fila3++;
                $a++;
            }
            $writer = new Xlsx( $spreadsheet );
            ob_start();
            $writer->save( 'php://output' );
            $contenido = ob_get_clean();
            $excelBase64 = base64_encode( $contenido );
            $excel = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' . $excelBase64;
            $this->respuestaJSON( ['codigo' => 1, 'mensaje' => 'Se generó correctamente', 'reporte' => $excel, 'nombre' => $razon_social, 'tipo' => 'DOFA', 'ext' => '.xlsx'] );
        } catch ( ValidacionExcepcion $error ) {
            $this->respuestaJSON( ['codigo' => $error->getCode(), 'mensaje' => $error->getMessage()] );
        }
    }
}

$controlador = new GestionUsuarioControlador();
$opcion = $_GET['opcion'];
$controlador->$opcion();
