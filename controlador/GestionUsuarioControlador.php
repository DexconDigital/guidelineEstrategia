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
            Validacion::validar( ['general' => 'obligatorio'], $_POST );
            $id_empresa = $_POST['id_empresa'];
            $general = $_POST['general'];
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
                                <td style='width:60%;border: 0.5px solid #858796;text-align: center;background-color:; color:;padding:0;'><img style='width:18px;' src='{$ruta}{$data_icono[$i]}.svg'></td>
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

}

$controlador = new GestionUsuarioControlador();
$opcion = $_GET['opcion'];
$controlador->$opcion();
