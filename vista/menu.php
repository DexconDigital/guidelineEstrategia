<?php
session_start();
if ( !isset( $_SESSION['usuario_planfuturo'] ) ) {
    header( 'Location:iniciosesion.php' );
}
?>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Inicio</title>
    <link rel="icon" type="image/png" href="../img/favicon.png">
    <!-- Custom fonts for this template-->
    <link href="../vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
    <link rel="stylesheet" href="../css/dist/sweetalert.css">
    <!-- Custom styles for this template-->
    <link href="../css/sb-admin-2.css?v=2" rel="stylesheet">
    <link href="../css/styles.css?v=2" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/css/bootstrap-datepicker.css" rel="stylesheet" />
</head>
<div class="loader">
    <img class="preload" src="../img/preloader.gif">
</div>

<body id="page-top" class="">
    <div id="wrapper">
        <!-- Sidebar -->
        <ul class="navbar-nav sidebar sidebar-dark accordion color-empresa color-navbar" id="accordionSidebar">
            <div class="sidebar-brand d-flex align-items-center justify-content-center bg-light border">
                <img src="../img/logo.png" id="img_logo" class="logo">
            </div>
            <!-- Divider -->
            <hr class="sidebar-divider my-0">

            <!-- Menu -->
            <li class="nav-item">
                <a class="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapseuno" aria-expanded="true" aria-controls="collapseuno">
                    <i class="fas fa-fw fa-cog"></i>
                    <span>¿Quienes somos?</span>
                </a>
                <div id="collapseuno" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <a class="collapse-item" href="#!" data-toggle="modal" data-target="#modalempresa1">La Empresa</a>
                        <a class="collapse-item" href="#!" data-toggle="modal" data-target="#modalprincipios">Principios Corporativos</a>
                        <a class="collapse-item" href="#!" data-toggle="modal" data-target="#modalmision">Misión</a>
                        <a class="collapse-item" href="#!" data-toggle="modal" data-target="#modalvision">Visión</a>
                    </div>
                </div>
            </li>
            <li class="nav-item">
                <a class="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapsedos" aria-expanded="true" aria-controls="collapsedos">
                    <i class="fas fa-fw fa-cog"></i>
                    <span>¿Cómo estamos hoy?</span>
                </a>
                <div id="collapsedos" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <a class="collapse-item" href="#!" data-toggle="modal" data-target="#modalpci" id="pci">Diagnostico PCI</a>
                        <a class="collapse-item" href="#!" data-toggle="modal" data-target="#modalpoam" id="poam">Diagnostico POAM</a>
                        <a class="collapse-item" href="#!" data-toggle="modal" data-target="#modaldofa" id="dofa">DOFA resumido</a>
                        <a class="collapse-item" href="#!" data-toggle="modal" data-target="#modaldofaanalisis" id="dofaana">DOFA análisis</a>
                        <a class="collapse-item estrategias" href="#!" data-toggle="modal" data-target="#modalseguimientos" id="btnseguimientos">Seguimientos</a>
                        <a class="collapse-item estrategias" href="#!" data-toggle="modal" data-target="#modalfuerzas" id="btnfuerzas">Fuerzas-Porter</a>
                        <a class="collapse-item estrategias" href="#!" data-toggle="modal" data-target="#modalbcg" id="btnbcg">Matriz BCG</a>
                    </div>
                </div>
            </li>
            <li class="nav-item">
                <a class="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapsetres" aria-expanded="true" aria-controls="collapsetres">
                    <i class="fas fa-fw fa-cog"></i>
                    <span>¿Dónde queremos estar?</span>
                </a>
                <div id="collapsetres" class="collapse" aria-labelledby="headingtres" data-parent="#accordionSidebar">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <a class="collapse-item estrategias" href="#!" data-toggle="modal" data-target="#modalprincipios2" id="btnprincipios2">Principios Corporativos</a>
                        <a class="collapse-item estrategias" href="#!" data-toggle="modal" data-target="#modalestrategias" id="btnestrategias">Estrategias</a>
                    </div>
                </div>
            </li>
            <li class="nav-item">
                <a class="nav-link collapsed" href="#!" data-toggle="collapse" data-target="#collapsecuatro" aria-expanded="true" aria-controls="collapsecuatro">
                    <i class="fas fa-fw fa-cog"></i>
                    <span>¿Qué hacer para lograrlo?</span>
                </a>
                <div id="collapsecuatro" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <a class="collapse-item estrategias" href="#!" data-toggle="modal" data-target="#modalmando" id="btnbalanced">Balanced Scorecard</a>
                        <a class="collapse-item estrategias" href="#!" data-toggle="modal" data-target="#modalcmi">Tablero de indicadores</a>
                    </div>
                </div>
            </li>

            <!-- Divider -->
            <hr class="sidebar-divider d-none d-md-block">

            <!-- Sidebar Toggler ( Sidebar ) -->
            <div class="text-center d-none d-md-inline">
                <button class="rounded-circle border-0" id="sidebarToggle"></button>
            </div>

        </ul>
        <!-- fin Sidebar -->

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">
            <!-- Main Content -->
            <div id="content">
                <!-- Topbar -->
                <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                    <!-- Sidebar Toggle ( Topbar ) -->
                    <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle mr-3">
                        <i class="fa fa-bars"></i>
                    </button>

                    <!-- Topbar Navbar -->
                    <ul class="navbar-nav ml-auto">

                        <!-- Nav Item - User Information -->
                        <li class="nav-item dropdown no-arrow">
                            <a class="nav-link dropdown-toggle" href="#!" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="mr-2 d-none d-lg-inline text-gray-600 small" id="nombre_empresa"></span>
                                <img class="img-profile rounded-circle" src="../img/perfil.png">
                            </a>
                            <!-- Dropdown - User Information -->
                            <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                                <a class="dropdown-item" href="#!" id="usuarios">
                                    <i class="fas fa-users fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Usuarios
                                </a>
                                <a class="dropdown-item" href="#!" data-toggle="modal" data-target="#logoutModal">
                                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    salir
                                </a>
                            </div>
                        </li>

                    </ul>

                </nav>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <div class="container-fluid">

                    <!-- Page Heading -->
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h3 mb-0 text-gray-800">Plan de Futuro</h1>
                    </div>
                    <!-- Content Row -->
                    <div class="row">
                        <div class="col-lg-6 mb-4">
                            <!-- Illustrations -->
                            <div class="card shadow mb-4">
                                <div class="card-header py-3">
                                    <h6 class="m-0 text-primary">Ejemplo</h6>
                                </div>
                                <div class="card-body">
                                    <div class="text-center">
                                        <img class="img-fluid px-3 px-sm-4 mt-3 mb-4" style="width: 25rem;" src="../img/logo.png" alt="...">
                                    </div>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                                    <a target="_blank" rel="nofollow" href="https://www.dexcondigital.com">Visitar</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /.container-fluid -->
            </div>
            <!-- Footer -->
            <footer class="sticky-footer bg-white">
                <div class="container my-auto">
                    <div class="text-center my-auto copyright text-muted">
                        <div>Diseñado y Desarrollado por Dexcon Consultores SAS | <a href="https://www.dexcondigital.com/" target="_blank">Dexcon Digital</a><span class="dexcon_copy"> © Copyright <?php echo date('Y' ) ?>. Todos los derechos reservados.</span></div>
                    </div>
                </div>
            </footer>
            <!-- End of Footer -->
        </div>
        <!-- End of Content Wrapper -->
    </div>
    <!-- End of Page Wrapper -->

    <!-- Scroll to Top Button-->
    <a class="scroll-to-top rounded align-middle" href="#page-top">
        <i class="fas fa-angle-up"></i>
    </a>
    <!-- Modal empresa -->
    <div class="modal fade" id="modalempresa1" tabindex="-1" role="dialog" aria-labelledby="examplemodalempresa1" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-negro" id="examplemodalempresa1">Planeación estratégica</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="frm_empresa1">
                        <div class="form-group">
                            <label for="nit" class="col-form-label text-negro">NIT:</label>
                            <input type="text" class="form-control form-control-sm" id="nit">
                        </div>
                        <div class="form-group">
                            <label for="razon_social" class="col-form-label text-negro">Razón social:</label>
                            <input type="text" class="form-control form-control-sm" id="razon_social">
                        </div>
                        <div class="form-group">
                            <label for="fecha" class="col-form-label text-negro">Fecha:</label>
                            <input type="date" class="form-control form-control-sm" id="fecha">
                        </div>
                        <div class="form-row">
                            <div class="col-sm-3 my-auto">
                                <label class="col-form-label text-negro">Horizonte estratégico</label>
                            </div>
                            <div class="col-sm-3">
                                <div class="form-group">
                                    <label for="horizonte_inicial" class="col-form-label text-negro">Año inicial:</label>
                                    <input type="number" class="yearpicker form-control form-control-sm" id="horizonte_inicial" min="1900" max="2099" step="1">
                                </div>
                            </div>
                            <div class="col-sm-3">
                                <div class="form-group">
                                    <label for="horizonte_final" class="col-form-label text-negro">Año final:</label>
                                    <input type="number" class="form-control form-control-sm yearpicker" id="horizonte_final" min="1900" max="2099" step="1">
                                </div>
                            </div>
                            <div class="col-sm-3">
                                <div class="form-group">
                                    <label for="horizonte_noanios" class="col-form-label text-negro">No año:</label>
                                    <input type="number" class="form-control form-control-sm" id="horizonte_noanios" readonly>
                                </div>
                            </div>
                        </div>
                        <div class="msg1"></div>
                        <div class="form-row">
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="color" class="col-form-label text-negro ">Color corporativo:</label>
                                    <input type="color" class="form-control form-control-color h-35" id="color">
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <label for="logo" class="col-form-label text-negro">Logo empresa:</label>
                                    <input type="file" class="form-control-file" accept="image/*" id="logo">
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <table class="table table-sm listable">
                                    <thead>
                                        <tr class="text-center">
                                            <th class="w-75 text-negro">Los Estrategas</th>
                                            <th class="text-center w-25"><a href="#!" class="btn btn-success btn-sm addRow">Agregar</a></th>
                                        </tr>
                                    </thead>
                                    <tbody class="text-center" id="cuerpo_estrategas">
                                        <tr class="cb" id="row_0">
                                            <td><input type="text" name="pos" id="pos_0" class="form-control form-control-sm first estratega"></td>
                                            <td><a href="#!" class="btn btn-danger btn-sm remove ">Remover</a></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-negro" type="button" data-dismiss="modal">Cerrar</button>
                    <button class="btn btn-success" id="btnmodificar_empresa">Guardar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal misión -->
    <div class="modal fade" id="modalmision" tabindex="-1" role="dialog" aria-labelledby="exampleModalmision" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text-negro" id="exampleModalmision">Formulación de la misión</h4>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-negro">
                    <h5 class="text-center">Misión</h5>
                    <div class="container">
                        <p class="text-center">Debe responder a:</p>
                        <p>¿En que negocio estamos?: Cual es el negocio?;
                            Para que existe la empresa? Propositos;
                            Cuales son los elementos diferenciales?: Aptitud distintiva. Quienes son nuestros clientes?;
                            Cuales son los productos o servicios?;
                            Cuales son los mercados presentes y futuros</p>
                        <p class="mt-2"><b>¿Quién formula la mision? La formulación de la misión es responsabilidad de la alta dirección de la empresa o de la unidad estratégica de negocio.</b></p>
                        <h5 class="text-center mt-4">Formule su Misión:</h5>
                        <textarea class="form-control" id="mision_text"></textarea>
                    </div>

                </div>
                <div class="modal-footer">
                    <button class="btn btn-negro" type="button" data-dismiss="modal">Cancelar</button>
                    <button class="btn btn-success" id="btn_mision">Guardar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal visión -->
    <div class="modal fade" id="modalvision" tabindex="-1" role="dialog" aria-labelledby="exampleModalvision" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text-negro" id="exampleModalvision">Formulación de la visión</h4>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-negro">
                    <h5 class="text-center">Visión</h5>
                    <div class="container">
                        <p>La visión corporativa es un conjunto de ideas generales, algunas de ellas abstractas, que proveen el marco de referencia de lo que una empresa quiere y espera ser en el futuro. La visión señala el camino que permite a la alta gerencia establecer el rumbo para lograr el desarrollo esperado de la organización en el futuro. La Visión debe ser: </p>
                        <ul>
                            <li class="list-unstyled">1. Formulada para los líderes de la organización.</li>
                            <li class="list-unstyled">2. Ser formulada teniendo claramente definido un horizonte de tiempo.</li>
                            <li class="list-unstyled">3. Debe ser apoyada y compartida por el grupo gerencial, así como por todos los colaboradores de la empresa.</li>
                            <li class="list-unstyled">4. Amplia y detallada.</li>
                            <li class="list-unstyled">5. Positiva y Alentadora</li>
                        </ul>
                        <h5 class="text-center mt-3">Formule su visión:</h5>
                        <textarea class="form-control" id="vision_text"></textarea>
                    </div>

                </div>
                <div class="modal-footer">
                    <button class="btn btn-negro" type="button" data-dismiss="modal">Cancelar</button>
                    <button class="btn btn-success" id="btn_vision">Guardar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Principios Corporativos -->
    <div class="modal fade" id="modalprincipios" tabindex="-1" role="dialog" aria-labelledby="exampleModalprincipios" aria-hidden="true">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text-negro" id="exampleModalprincipios">Principios Corporativos</h4>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-negro">
                    <!-- axiologicas -->
                    <div id="axiologicas">
                        <div class="row">
                            <div class="col-sm-6">
                                <h5>La matriz axiologica</h5>
                            </div>
                            <div class="col-sm-6">
                                <p>Nota: Colocar un 1 en la celda donde considere que el principio es importante para el grupo de referencia.</p>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <div class="mh-350">
                                <table class="table text-negro table-bordered table-sm w-100 listableaxio">
                                    <thead>
                                        <tr>
                                            <th class="sticky-top color-empresa w-1"></th>
                                            <th class="sticky-top color-empresa">Principio/grupo</th>
                                            <th class="calculo sticky-top color-empresa">Sociedad</th>
                                            <th class="calculo sticky-top color-empresa">Estado</th>
                                            <th class="calculo sticky-top color-empresa">Familia</th>
                                            <th class="calculo sticky-top color-empresa">Clientes</th>
                                            <th class="calculo sticky-top color-empresa">Proveedores</th>
                                            <th class="calculo sticky-top color-empresa">Colaboradores</th>
                                            <th class="calculo sticky-top color-empresa">Accionistas/dueños</th>
                                            <th class="text-center w-1 sticky-top color-empresa"><a href="#!" class="btn btn-success btn-sm addRowaxio">Agregar</a></th>
                                        </tr>
                                    </thead>
                                    <tbody class="cuerpo_axiologica">
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="2" class="sticky-bottom color-empresa"></td>
                                            <td class="text-center align-middle totalcolumna2 sticky-bottom color-empresa">0%</td>
                                            <td class="text-center align-middle totalcolumna3 sticky-bottom color-empresa">0%</td>
                                            <td class="text-center align-middle totalcolumna4 sticky-bottom color-empresa">0%</td>
                                            <td class="text-center align-middle totalcolumna5 sticky-bottom color-empresa">0%</td>
                                            <td class="text-center align-middle totalcolumna6 sticky-bottom color-empresa">0%</td>
                                            <td class="text-center align-middle totalcolumna7 sticky-bottom color-empresa">0%</td>
                                            <td class="text-center align-middle totalcolumna8 sticky-bottom color-empresa">0%</td>
                                            <td class="sticky-bottom color-empresa"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-success" id="btn_axo">Grabar Axiologicas</button>
                        </div>
                    </div>

                    <hr>
                    <!-- Grupos de Referencia -->
                    <div id="Referencia">
                        <div class="row">
                            <div class="col-sm-6">
                                <h5>Los grupos de referencia</h5>
                            </div>
                            <div class="col-sm-6">
                                <p>Nota: según los resultados defina los principios a seguir con cada grupo de referencia.</p>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table text-negro table-bordered table-sm w-100 listareferencia">
                                <tbody class="cuerpo_referencia">
                                </tbody>
                            </table>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-success" id="btn_referencia">Grabar Referencias</button>
                        </div>
                    </div>
                    <hr>
                    <!-- Principios corporativos -->
                    <div id="Principios">
                        <div class="row">
                            <div class="col-sm-6">
                                <h5>Los principios corporativos</h5>
                            </div>
                            <div class="col-sm-6">
                                <p>Nota: Enuncie los principios corporativos que deben regir su organización, descríbalos.</p>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table text-negro table-bordered table-sm w-100 listaprincipios">
                                <thead>
                                    <tr>
                                        <th class="w-75 color-empresa"></th>
                                        <th class="text-center color-empresa"><a href="#!" class="btn btn-success btn-sm agregarprincipios">Agregar</a></th>
                                    </tr>
                                </thead>
                                <tbody class="cuerpo_principios">
                                </tbody>
                            </table>
                        </div>
                        <div class="d-flex justify-content-end bg-white">
                            <button class="btn btn-success" id="btn_principios">Grabar Principios</button>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-negro" type="button" data-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Diagnostico interno ( PCI ) -->
    <div class="modal fade modalvalidacion" id="modalpci" tabindex="-1" role="dialog" aria-labelledby="exampleModalpci" aria-hidden="true" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text-negro" id="exampleModalpci">PCI: perfil de capacidad interna</h4>
                    <button class="close cerrar" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-negro">
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 active navlistapci" id="pills-Directiva-tab" data-toggle="pill" href="#pills-Directiva" type="button" role="tab" aria-controls="pills-Directiva" aria-selected="true">1. Directiva</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 navlistapci1a" id="pills-Competitiva-tab" data-toggle="pill" href="#pills-Competitiva" type="button" role="tab" aria-controls="pills-Competitiva" aria-selected="false" disabled>2. Competitiva</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 navlistapci2a" id="pills-Financiera-tab" data-toggle="pill" href="#pills-Financiera" type="button" role="tab" aria-controls="pills-Financiera" aria-selected="false" disabled>3. Financiera</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 navlistapci3a" id="pills-Tecnologica-tab" data-toggle="pill" href="#pills-Tecnologica" type="button" role="tab" aria-controls="pills-Tecnologica" aria-selected="false" disabled>4. Tecnológica</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 navlistapci4a" id="pills-Talento-tab" data-toggle="pill" href="#pills-Talento" type="button" role="tab" aria-controls="pills-Talento" aria-selected="false" disabled>5. Talento humano</button>
                        </li>
                    </ul>
                    <div class="alertadiagnostico"></div>
                    <div class="tab-content" id="pills-tabContent">
                        <!-- 1. Capacidad directiva -->
                        <div class="tab-pane fade show active" id="pills-Directiva" role="tabpanel" aria-labelledby="pills-Directiva-tab">
                            <div id="PCI1" class="border p-2">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th colspan="8">Perspectiva desde procesos internos</th>
                                                <th colspan="1" class="text-center"><a href="#!" class="btn btn-success btn-sm agregarpci" data-index="1">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mh-350">
                                        <table class="text-negro table-bordered table-sm w-100 listapci1 mw-45">
                                            <thead>
                                                <tr class="color-empresa">
                                                    <th colspan="3" class="w-35 titulo">1. Capacidad directiva</th>
                                                    <th colspan="3" class="w-35">Fortaleza</th>
                                                    <th colspan="3" class="w-35">Debilidad</th>
                                                </tr>
                                                <tr class="text-light">
                                                    <th class="sticky-top color-empresa" colspan="3">Descripción de factores</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_pci1" data-tabla="listapci1"></tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="3" class="sticky-bottom color-empresa">Calificación capacidad directiva</td>
                                                    <td colspan="3" class="text-right total_fortaleza sticky-bottom color-empresa"></td>
                                                    <td colspan="3" class="text-right total_debilidad sticky-bottom color-empresa"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_pci" id="btn_pci" data-index="1">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 2. Capacidad competitiva -->
                        <div class="tab-pane fade" id="pills-Competitiva" role="tabpanel" aria-labelledby="pills-Competitiva-tab">
                            <div id="PCI2" class="mt-3 border p-2">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th colspan="8">Perspectiva cliente</th>
                                                <th colspan="1" class="text-center"><a href="#!" class="btn btn-success btn-sm agregarpci" data-index="2">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mh-350">
                                        <table class="text-negro table-bordered table-sm w-100 listapci2 mw-45">
                                            <thead>
                                                <tr class="color-empresa">
                                                    <th colspan="3" class="w-35 titulo">2. Capacidad competitiva</th>
                                                    <th colspan="3" class="w-35">Fortaleza</th>
                                                    <th colspan="3" class="w-35">Debilidad</th>
                                                </tr>
                                                <tr class="text-light">
                                                    <th class="sticky-top color-empresa" colspan="3">Descripción de factores</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_pci2" data-tabla="listapci2"></tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="3" class="sticky-bottom color-empresa">Calificación capacidad competitiva</td>
                                                    <td colspan="3" class="text-right total_fortaleza sticky-bottom color-empresa"></td>
                                                    <td colspan="3" class="text-right total_debilidad sticky-bottom color-empresa"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_pci" id="btn_pci2" data-index="2">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 3. Capacidad financiera -->
                        <div class="tab-pane fade" id="pills-Financiera" role="tabpanel" aria-labelledby="pills-Financiera-tab">
                            <div id="PCI3" class="mt-3 border p-2">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th colspan="8">Perspectiva financiera</th>
                                                <th colspan="1" class="text-center"><a href="#!" class="btn btn-success btn-sm agregarpci" data-index="3">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mh-350">
                                        <table class="text-negro table-bordered table-sm w-100 listapci3 mw-45">
                                            <thead>
                                                <tr class="color-empresa">
                                                    <th colspan="3" class="w-35 titulo">3. Capacidad financiera</th>
                                                    <th colspan="3" class="w-35">Fortaleza</th>
                                                    <th colspan="3" class="w-35">Debilidad</th>
                                                </tr>
                                                <tr class="text-light">
                                                    <th class="sticky-top color-empresa" colspan="3">Descripción de factores</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_pci3" data-tabla="listapci3"></tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="3" class="sticky-bottom color-empresa">Calificación capacidad financiera</td>
                                                    <td colspan="3" class="text-right total_fortaleza sticky-bottom color-empresa"></td>
                                                    <td colspan="3" class="text-right total_debilidad sticky-bottom color-empresa"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_pci" id="btn_pci3" data-index="3">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 4. Capacidad tecnológica -->
                        <div class="tab-pane fade" id="pills-Tecnologica" role="tabpanel" aria-labelledby="pills-Tecnologica-tab">
                            <div id="PCI4" class="mt-3 border p-2">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th colspan="8">Perspectiva procesos</th>
                                                <th colspan="1" class="text-center"><a href="#!" class="btn btn-success btn-sm agregarpci" data-index="4">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mh-350">
                                        <table class="text-negro table-bordered table-sm w-100 listapci4 mw-45">
                                            <thead>
                                                <tr class="color-empresa">
                                                    <th colspan="3" class="w-35 titulo">4. Capacidad tecnológica</th>
                                                    <th colspan="3" class="w-35">Fortaleza</th>
                                                    <th colspan="3" class="w-35">Debilidad</th>
                                                </tr>
                                                <tr class="text-light">
                                                    <th class="sticky-top color-empresa" colspan="3">Descripción de factores</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_pci4" data-tabla="listapci4"></tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="3" class="sticky-bottom color-empresa">Calificación capacidad tecnológica</td>
                                                    <td colspan="3" class="text-right total_fortaleza sticky-bottom color-empresa"></td>
                                                    <td colspan="3" class="text-right total_debilidad sticky-bottom color-empresa"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_pci" id="btn_pci4" data-index="4">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 5. Capacidad talento humano -->
                        <div class="tab-pane fade" id="pills-Talento" role="tabpanel" aria-labelledby="pills-Talento-tab">
                            <div id="PCI5" class="mt-3 border p-2">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th colspan="8">Perspectiva talento humano</th>
                                                <th colspan="1" class="text-center"><a href="#!" class="btn btn-success btn-sm agregarpci" data-index="5">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mh-350">
                                        <table class="text-negro table-bordered table-sm w-100 listapci5 mw-45">
                                            <thead>
                                                <tr class="color-empresa">
                                                    <th colspan="3" class="w-35 titulo">5. Capacidad del talento humano</th>
                                                    <th colspan="3" class="w-35">Fortaleza</th>
                                                    <th colspan="3" class="w-35">Debilidad</th>
                                                </tr>
                                                <tr class="text-light">
                                                    <th class="sticky-top color-empresa" colspan="3">Descripción de factores</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_pci5" data-tabla="listapci5"></tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="3" class="sticky-bottom color-empresa">Calificación capacidad de talento humano</td>
                                                    <td colspan="3" class="text-right total_fortaleza sticky-bottom color-empresa"></td>
                                                    <td colspan="3" class="text-right total_debilidad sticky-bottom color-empresa"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_pci" id="btn_pci5" data-index="5">Grabar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-negro cerrar" type="button">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Diagnostico externo ( POAM ) -->
    <div class="modal fade modalvalidacion" id="modalpoam" tabindex="-1" role="dialog" aria-labelledby="exampleModalpoam" aria-hidden="true" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text-negro" id="exampleModalpci">POAM: perfil de oportunidades y amenazas del medio</h4>
                    <button class="close cerrar" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-negro">
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 active navlistapoam" id="pills-Economicos-tab" data-toggle="pill" href="#pills-Economicos" type="button" role="tab" aria-controls="pills-Economicos" aria-selected="true">1. Económicos</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 navlistapoam1a" id="pills-Politicos-tab" data-toggle="pill" href="#pills-Politicos" type="button" role="tab" aria-controls="pills-Politicos" aria-selected="false" disabled>2. Politicos</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 navlistapoam2a" id="pills-Sociales-tab" data-toggle="pill" href="#pills-Sociales" type="button" role="tab" aria-controls="pills-Sociales" aria-selected="false" disabled>3. Sociales</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 navlistapoam3a" id="pills-Tecnologicos-tab" data-toggle="pill" href="#pills-Tecnologicos" type="button" role="tab" aria-controls="pills-Tecnologicos" aria-selected="false" disabled>4. Tecnológicos</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 navlistapoam4a" id="pills-Geograficos-tab" data-toggle="pill" href="#pills-Geograficos" type="button" role="tab" aria-controls="pills-Geograficos" aria-selected="false" disabled>5. Geográficos</button>
                        </li>
                    </ul>
                    <div class="alertadiagnostico"></div>
                    <div class="tab-content" id="pills-tabContent">
                        <!-- 1. Factores económicos -->
                        <div class="tab-pane fade show active" id="pills-Economicos" role="tabpanel" aria-labelledby="pills-Economicos-tab">
                            <div id="POAM1" class="border p-2">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th class="w-75"></th>
                                                <th colspan="1" class="text-center"><a href="#!" class="btn btn-success btn-sm agregarpoam" data-index="1">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mh-350">
                                        <table class="text-negro table-bordered table-sm w-100 listapoam1 mw-45">
                                            <thead>
                                                <tr class="color-empresa">
                                                    <th colspan="3" class="w-35 titulo">1. Factores económicos</th>
                                                    <th colspan="3" class="w-35">Fortaleza</th>
                                                    <th colspan="3" class="w-35">Debilidad</th>
                                                </tr>
                                                <tr class="text-light">
                                                    <th class="sticky-top color-empresa" colspan="3">Descripción del diagnóstico</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_poam1" data-tabla="listapoam1"></tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="3" class="sticky-bottom color-empresa">Calificación Factores económicos</td>
                                                    <td colspan="3" class="text-right total_fortaleza sticky-bottom color-empresa"></td>
                                                    <td colspan="3" class="text-right total_debilidad sticky-bottom color-empresa"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_poam" id="btn_poam" data-index="1">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 2. Factores politicos -->
                        <div class="tab-pane fade" id="pills-Politicos" role="tabpanel" aria-labelledby="pills-Politicos-tab">
                            <div id="POAM2" class="mt-3 border p-2">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th class="w-75"></th>
                                                <th colspan="1" class="text-center"><a href="#!" class="btn btn-success btn-sm agregarpoam" data-index="2">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mh-350">
                                        <table class="text-negro table-bordered table-sm w-100 listapoam2 mw-45">
                                            <thead>
                                                <tr class="color-empresa">
                                                    <th colspan="3" class="w-35 titulo">2. Factores politicos</th>
                                                    <th colspan="3" class="w-35">Fortaleza</th>
                                                    <th colspan="3" class="w-35">Debilidad</th>
                                                </tr>
                                                <tr class="text-light">
                                                    <th class="sticky-top color-empresa" colspan="3">Descripción del diagnóstico</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_poam2" data-tabla="listapoam2"></tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="3" class="sticky-bottom color-empresa">Calificación Factores politicos</td>
                                                    <td colspan="3" class="text-right total_fortaleza sticky-bottom color-empresa"></td>
                                                    <td colspan="3" class="text-right total_debilidad sticky-bottom color-empresa"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_poam" id="btn_poam2" data-index="2">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 3. Factores sociales -->
                        <div class="tab-pane fade" id="pills-Sociales" role="tabpanel" aria-labelledby="pills-Sociales-tab">
                            <div id="POAM3" class="mt-3 border p-2">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th class="w-75"></th>
                                                <th colspan="1" class="text-center"><a href="#!" class="btn btn-success btn-sm agregarpoam" data-index="3">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mh-350">
                                        <table class="text-negro table-bordered table-sm w-100 listapoam3 mw-45">
                                            <thead>
                                                <tr class="color-empresa">
                                                    <th colspan="3" class="w-35 titulo">3. Factores sociales</th>
                                                    <th colspan="3" class="w-35">Fortaleza</th>
                                                    <th colspan="3" class="w-35">Debilidad</th>
                                                </tr>
                                                <tr class="text-light">
                                                    <th class="sticky-top color-empresa" colspan="3">Descripción del diagnóstico</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_poam3" data-tabla="listapoam3"></tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="3" class="sticky-bottom color-empresa">Calificación factores sociales</td>
                                                    <td colspan="3" class="text-right total_fortaleza sticky-bottom color-empresa"></td>
                                                    <td colspan="3" class="text-right total_debilidad sticky-bottom color-empresa"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_poam" id="btn_poam3" data-index="3">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 4. Factores tecnológicos -->
                        <div class="tab-pane fade" id="pills-Tecnologicos" role="tabpanel" aria-labelledby="pills-Tecnologicos-tab">
                            <div id="POAM4" class="mt-3 border p-2">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th class="w-75"></th>
                                                <th colspan="1" class="text-center"><a href="#!" class="btn btn-success btn-sm agregarpoam" data-index="4">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mh-350">
                                        <table class="text-negro table-bordered table-sm w-100 listapoam4 mw-45">
                                            <thead>
                                                <tr class="color-empresa">
                                                    <th colspan="3" class="w-35 titulo">4. Factores tecnológicos</th>
                                                    <th colspan="3" class="w-35">Fortaleza</th>
                                                    <th colspan="3" class="w-35">Debilidad</th>
                                                </tr>
                                                <tr class="text-light">
                                                    <th class="sticky-top color-empresa" colspan="3">Descripción del diagnóstico</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_poam4" data-tabla="listapoam4"></tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="3" class="sticky-bottom color-empresa">Calificación factores tecnológicos</td>
                                                    <td colspan="3" class="text-right total_fortaleza sticky-bottom color-empresa"></td>
                                                    <td colspan="3" class="text-right total_debilidad sticky-bottom color-empresa"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_poam" id="btn_poam4" data-index="4">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 5. Factores geograficos -->
                        <div class="tab-pane fade" id="pills-Geograficos" role="tabpanel" aria-labelledby="pills-Geograficos-tab">
                            <div id="POAM5" class="mt-3 border p-2">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th class="w-75"></th>
                                                <th colspan="1" class="text-center"><a href="#!" class="btn btn-success btn-sm agregarpoam" data-index="5">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mh-350">
                                        <table class="text-negro table-bordered table-sm w-100 listapoam5 mw-45">
                                            <thead>
                                                <tr class="color-empresa">
                                                    <th colspan="3" class="w-35 titulo">5. Factores geograficos</th>
                                                    <th colspan="3" class="w-35">Fortaleza</th>
                                                    <th colspan="3" class="w-35">Debilidad</th>
                                                </tr>
                                                <tr class="text-light">
                                                    <th class="sticky-top color-empresa" colspan="3">Descripción del diagnostico</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                    <th class="sticky-top color-empresa">Nivel</th>
                                                    <th class="sticky-top color-empresa">Impacto</th>
                                                    <th class="sticky-top color-empresa">N*1</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_poam5" data-tabla="listapoam5"></tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="3" class="sticky-bottom color-empresa">Calificación factores geograficos</td>
                                                    <td colspan="3" class="text-right total_fortaleza sticky-bottom color-empresa"></td>
                                                    <td colspan="3" class="text-right total_debilidad sticky-bottom color-empresa"></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_poam" id="btn_poam5" data-index="5">Grabar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-negro cerrar" type="button">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal DOFA resumido -->
    <div class="modal fade modalvalidacion" id="modaldofa" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-negro" id="exampleModalLabel2">DOFA Resumido</h5>
                    <button class="close cerrar" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-negro">
                    <div class="row">
                        <div class="col-lg-8">
                            <!-- Resultados PCI -->
                            <div id="pci_total">
                                <div class="text-center">
                                    <h5>PCI: Perfil de capacidad interna</h5>
                                </div>
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100 listapcitotal mw-45">
                                        <thead>
                                            <tr>
                                                <th class="sticky-top color-empresa w-50">Item</th>
                                                <th class="sticky-top color-empresa text-center">Fortaleza</th>
                                                <th class="sticky-top color-empresa text-center">Debilidad</th>
                                            </tr>
                                        </thead>
                                        <tbody class="cuerpo_pci-total" data-tabla="listapcitotal"></tbody>
                                        <tfoot>
                                            <tr>
                                                <td class="sticky-bottom color-empresa">Total PCI</td>
                                                <td class="text-center total_fortaleza sticky-bottom color-empresa">0%</td>
                                                <td class="text-center total_debilidad sticky-bottom color-empresa">0%</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" class="sticky-bottom color-empresa">Nivel de fortaleza de la organización</td>
                                                <td class="text-center sticky-bottom color-empresa total_general_pci">0%</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <!-- Resultados POAM -->
                            <div id="poam_total" class="mt-4">
                                <div class="text-center">
                                    <h5>POAM: Perfil de oportunidades y amenazas</h5>
                                </div>
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100 listapoamtotal mw-45">
                                        <thead>
                                            <tr>
                                                <th class="sticky-top color-empresa w-50">Item</th>
                                                <th class="sticky-top color-empresa text-center">Oportunidad</th>
                                                <th class="sticky-top color-empresa text-center">Amenaza</th>
                                            </tr>
                                        </thead>
                                        <tbody class="cuerpo_poam-total" data-tabla="listapoamtotal"></tbody>
                                        <tfoot>
                                            <tr>
                                                <td class="sticky-bottom color-empresa">Total POAM</td>
                                                <td class="text-center total_fortaleza sticky-bottom color-empresa">0%</td>
                                                <td class="text-center total_debilidad sticky-bottom color-empresa">0%</td>
                                            </tr>
                                            <tr>
                                                <td colspan="2" class="sticky-bottom color-empresa">Nivel de oportunidades de la organización</td>
                                                <td class="text-center sticky-bottom color-empresa total_general_poam">0%</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <!-- Análisis de resultados DOFA - resumida -->
                            <div id="dofa_total">
                                <div class="text-center">
                                    <h5>Análisis de resultados DOFA - resumida</h5>
                                </div>
                                <div class="mb-2">
                                    <textarea class="form-control" style="height:400px" id="dofa_text"></textarea>
                                </div>
                                <div class="d-flex justify-content-end">
                                    <button class="btn btn-success pb-2" id="btn_dofa">Grabar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-negro cerrar" type="button">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal DOFA análisis -->
    <div class="modal fade modalvalidacion" id="modaldofaanalisis" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-negro" id="exampleModalLabel2">DOFA: hoja de trabajo</h5>
                    <button class="close cerrar" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-negro">
                    <div class="text-justify mb-3">
                        <span>INSTRUCCIÓN: Con base en los resultados del DIAGNOSTICO PCI y el DIAGNOSTICO POAM haga lo siguiente:</span>
                    </div>
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 active" id="pills-oa-tab" data-toggle="pill" href="#pills-oa" type="button" role="tab" aria-controls="pills-oa" aria-selected="true" title="1. Oportunidades/Amenazas">1. O/A</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1" id="pills-ffofa-tab" data-toggle="pill" href="#pills-ffofa" type="button" role="tab" aria-controls="pills-ffofa" aria-selected="true" title="2. Fortalezas/Ataque/Defensivas">2. F/FO/FA</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1" id="pills-ddoda-tab" data-toggle="pill" href="#pills-ddoda" type="button" role="tab" aria-controls="pills-ddoda" aria-selected="true" title="3. Debilidades, Refuerzo o mejora, Mejora/ ó retirata">3. D/DO/DA</button>
                        </li>
                    </ul>
                    <div class="alerta"></div>
                    <div class="tab-content" id="pills-tabContent">
                        <!-- 1. Oportunidades/Amenazas -->
                        <div class="tab-pane fade show active" id="pills-oa" role="tabpanel" aria-labelledby="pills-oa-tab">
                            <div id="dofa_analisis_oa">
                                <div class="d-block mb-3">1 ) Incluya en las respectivas celdas las Fortalezas, Debilidades, Oportunidades y Amenazas que considere más relevantes. </div>
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th class="w-75">1.</th>
                                                <th class="text-center"><a href="#!" class="btn btn-success btn-sm agregardofaanalisis" data-index="1" data-cantidad="2">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mh-350">
                                        <table class="text-negro table-bordered table-sm listadofa1 w-100 mw-45">
                                            <thead>
                                                <tr>
                                                    <th class="sticky-top color-empresa"></th>
                                                    <th class="sticky-top color-empresa text-center">O</th>
                                                    <th class="sticky-top color-empresa text-center">Oportunidades</th>
                                                    <th class="sticky-top color-empresa text-center">A</th>
                                                    <th class="sticky-top color-empresa text-center">Amenazas</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_dofa1" data-tabla="listadofa1"></tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_dofaana" id="btn_dofaana1" data-index="1">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 2. Fortalezas/Ataque/Defensivas -->
                        <div class="tab-pane fade" id="pills-ffofa" role="tabpanel" aria-labelledby="pills-ffofa-tab">
                            <div id="dofa_analisis_ffofa">
                                <div class="d-block mb-3">2 ) Cruce las Fortalezas con las Oportunidades para construir las estrategias de Ataque, Las Fortalezas con las Amenazas para construir las estrategias defensivas, las Debilidades con las Oportunidades para construir las estrategias de Refuerzo y las Debilidades con las Amenzas para construir las estrategias de retirada.</div>
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th class="w-75">2.</th>
                                                <th class="text-center"><a href="#!" class="btn btn-success btn-sm agregardofaanalisis" data-index="2" data-cantidad="3">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mh-350">
                                        <table class="text-negro table-bordered table-sm listadofa2 w-100 mw-45">
                                            <thead>
                                                <tr>
                                                    <th class="sticky-top color-empresa text-center"></th>
                                                    <th class="sticky-top color-empresa text-center">F</th>
                                                    <th class="sticky-top color-empresa text-center">Fortalezas</th>
                                                    <th class="sticky-top color-empresa text-center">FO</th>
                                                    <th class="sticky-top color-empresa text-center">Estrategias FO ( Ataque )</th>
                                                    <th class="sticky-top color-empresa text-center">FA</th>
                                                    <th class="sticky-top color-empresa text-center">Estrategias FA ( Defensivas )</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_dofa2" data-tabla="listadofa2"></tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_dofaana" id="btn_dofaana2" data-index="2">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 3. Debilidades, Refuerzo o mejora, Mejora/ ó retirata -->
                        <div class="tab-pane fade" id="pills-ddoda" role="tabpanel" aria-labelledby="pills-ddoda-tab">
                            <div id="dofa_analisis_ddoda">
                                <div class="d-block mb-3">3 ) Tenga en cuenta que es posible que hayan fortalezas o debilidades que no tengan cruce con oportunidad o amenaza alguna para generar estrategias.</div>
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th class="w-75">3.</th>
                                                <th class="text-center"><a href="#!" class="btn btn-success btn-sm agregardofaanalisis" data-index="3" data-cantidad="3">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div class="mh-350">
                                        <table class="text-negro table-bordered table-sm listadofa3 w-100 mw-45">
                                            <thead>
                                                <tr>
                                                    <th class="sticky-top color-empresa text-center"></th>
                                                    <th class="sticky-top color-empresa text-center">D</th>
                                                    <th class="sticky-top color-empresa text-center">Debilidades</th>
                                                    <th class="sticky-top color-empresa text-center">DO</th>
                                                    <th class="sticky-top color-empresa text-center">Estrategias DO ( Refuerzo ó mejora )</th>
                                                    <th class="sticky-top color-empresa text-center">DA</th>
                                                    <th class="sticky-top color-empresa text-center">Estrategias DA ( Mejora/ ó retirata )</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_dofa3" data-tabla="listadofa3"></tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_dofaana" id="btn_dofaana3" data-index="3">Grabar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-negro cerrar" type="button">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Seguimientos -->
    <div class="modal fade modalvalidacion" id="modalseguimientos" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-negro" id="exampleModalLabel2">Seguimientos a las estrategias resultantes del plan de futuro</h5>
                    <button class="close cerrar" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-negro">
                    <!-- Seguimientos -->
                    <div id="seguimientos">
                        <div class="table-responsive">
                            <table class="text-negro table-bordered table-sm w-100">
                                <thead>
                                    <tr>
                                        <th class="w-75"></th>
                                        <th class="text-center"><a href="#!" class="btn btn-success btn-sm agregarseguiomiento">Agregar</a></th>
                                    </tr>
                                </thead>
                            </table>
                            <div class="mh-350">
                                <table class="table text-negro table-bordered table-sm w-100 listaseguimientos">
                                    <thead>
                                        <tr>
                                            <th class="sticky-top color-empresa w-1"></th>
                                            <th class="sticky-top color-empresa align-middle text-center w-25">Iniciativas estratégicas</th>
                                            <th class="calculo sticky-top color-empresa align-middle text-center">Fecha programada implementación</th>
                                            <th class="calculo sticky-top color-empresa align-middle text-center">Fecha seguimineto</th>
                                            <th class="calculo sticky-top color-empresa align-middle text-center">Planeado</th>
                                            <th class="calculo sticky-top color-empresa align-middle text-center">En ejecución</th>
                                            <th class="calculo sticky-top color-empresa align-middle text-center">Implementado</th>
                                            <th class="calculo sticky-top color-empresa text-center">% implementado a la fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody class="cuerpo_seguimientos">
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="2" class="sticky-bottom color-empresa"></td>
                                            <td colspan="5" class="sticky-bottom color-empresa">Promedio cumplimiento estrategias</td>
                                            <td class="text-center totalgeneral sticky-bottom ">0%</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-success" id="grabar_seguimiento">Grabar</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-negro cerrar" type="button">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Fuerzas -->
    <div class="modal fade modalvalidacion" id="modalfuerzas" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-negro" id="exampleModalLabel2">Diagnistico estratégico según michel porter</h5>
                    <button class="close cerrar" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-negro">
                    <!-- Fuerzas -->
                    <div id="fuerzas">
                        <div>
                            <p>Introduzca el diagnóstico actual de su compañía respecto de cada una de las fuerzas que la afectan propuestas por Porter.</p>
                        </div>
                        <div class="table-responsive">
                            <div>
                                <table class="table text-negro table-bordered table-sm w-100 listafuerzas mw-45">
                                    <thead>
                                        <tr>
                                            <th colspan="3" class="text-center color-empresa">Diagnostico estratégico de la compañía según el enfoque de Michael Porter</th>
                                        </tr>
                                        <tr>
                                            <th class="sticky-top color-empresa align-middle w-1">#</th>
                                            <th class="sticky-top color-empresa align-middle text-center">Las cinco fuerzas de Michael Porter</th>
                                            <th class="sticky-top color-empresa align-middle text-center">Diagnostico de la compañia</th>
                                        </tr>
                                    </thead>
                                    <tbody class="cuerpo_fuerzas">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-success" id="grabar_fuerzas">Grabar</button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-negro cerrar" type="button">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Matriz BCG -->
    <div class="modal fade modalvalidacion" id="modalbcg" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-negro" id="exampleModalLabel2">Matriz Boston Consulting Group</h5>
                    <button class="close cerrar" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-negro">
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 active" id="pills-estrellas-tab" data-toggle="pill" href="#pills-estrellas" type="button" role="tab" aria-controls="pills-estrellas" aria-selected="true">Estrellas</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1" id="pills-interrogantes-tab" data-toggle="pill" href="#pills-interrogantes" type="button" role="tab" aria-controls="pills-interrogantes" aria-selected="true">Interrogantes</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1" id="pills-vaca-tab" data-toggle="pill" href="#pills-vaca" type="button" role="tab" aria-controls="pills-vaca" aria-selected="true">Vaca lechera</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1" id="pills-perro-tab" data-toggle="pill" href="#pills-perro" type="button" role="tab" aria-controls="pills-perro" aria-selected="true">Perro</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button type="button" class="btn color-empresa m-1 dropdown-toggle bcg_reportes" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Reportes
                            </button>
                            <div class="dropdown-menu p-0">
                                <a class="dropdown-item bcg_reporte" data-reporte="pdf" href="#!">PDF</a>
                                <a class="dropdown-item bcg_reporte" data-reporte="excel" href="#!">Excel</a>
                            </div>
                        </li>
                    </ul>
                    <div class="alerta2"></div>
                    <div class="tab-content" id="pills-tabContent">
                        <!-- 1.Estrellas -->
                        <div class="tab-pane fade show active" id="pills-estrellas" role="tabpanel" aria-labelledby="pills-estrellas-tab">
                            <div id="estrellas">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100 mw-45">
                                        <thead>
                                            <tr>
                                                <th class="w-75"></th>
                                                <th class="text-center"><a href="#!" class="btn btn-success btn-sm agregarbcg" data-index="1">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div>
                                        <table class="text-negro table-bordered table-sm w-100 mw-45">
                                            <thead>
                                                <tr>
                                                    <th class="sticky-top color-empresa text-center align-middle w-50">Estrellas</th>
                                                    <th class="sticky-top color-empresa text-center align-middle"><i class="fas fa-star fa-lg" id="fa-star"></i></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class="bg-azul-claro">
                                                        <div class="m-2">
                                                            <div class="d-block">1 - Alta participación en el mercado</div>
                                                            <div class="d-block">2 - Mercados creciendo rápidamente</div>
                                                            <div class="d-block">3 - Se necesita mucho efectivo para financiar el crecimiento</div>
                                                            <div class="d-block">4 - Utilidades significativas</div>
                                                        </div>
                                                    </td>
                                                    <td class="align-top p-0 m-0">
                                                        <div class="mh-350">
                                                            <table class="w-100 bcggeneral listabcg1"></table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_bcg">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 2.Interrogantes -->
                        <div class="tab-pane fade" id="pills-interrogantes" role="tabpanel" aria-labelledby="pills-interrogantes-tab">
                            <div id="interrogantes">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100 mw-45">
                                        <thead>
                                            <tr>
                                                <th class="w-75"></th>
                                                <th class="text-center"><a href="#!" class="btn btn-success btn-sm agregarbcg" data-index="2">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div>
                                        <table class="text-negro table-bordered table-sm w-100 mw-45">
                                            <thead>
                                                <tr>
                                                    <th class="sticky-top color-empresa text-center align-middle w-50">Interrogantes</th>
                                                    <th class="sticky-top color-empresa text-center align-middle"><i class="far fa-question-circle fa-lg"></i></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class="bg-cyan-claro">
                                                        <div class="m-2">
                                                            <div class="d-block">1 - Baja participación en el mercado</div>
                                                            <div class="d-block">2 - Mercados creciendo rápidamente</div>
                                                            <div class="d-block">3 - Se necesita mucho efectivo para financiar el crecimiento</div>
                                                            <div class="d-block">4 - Debe evaluar seguir invirtiendo en el negocio</div>
                                                        </div>
                                                    </td>
                                                    <td class="align-top p-0 m-0">
                                                        <div class="mh-350">
                                                            <table class="w-100 bcggeneral listabcg2"></table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_bcg">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 3.Vaca lechera -->
                        <div class="tab-pane fade" id="pills-vaca" role="tabpanel" aria-labelledby="pills-vaca-tab">
                            <div id="vaca">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100 mw-45">
                                        <thead>
                                            <tr>
                                                <th class="w-75"></th>
                                                <th class="text-center"><a href="#!" class="btn btn-success btn-sm agregarbcg" data-index="3">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div>
                                        <table class="text-negro table-bordered table-sm w-100 mw-45">
                                            <thead>
                                                <tr>
                                                    <th class="sticky-top color-empresa text-center align-middle w-50">Vaca lechera</th>
                                                    <th class="sticky-top color-empresa text-center align-middle"><span class="fa-lg">🐮</span></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class="bg-amarillo-claro">
                                                        <div class="m-2">
                                                            <div class="d-block">1- Alta participación en el mercado</div>
                                                            <div class="d-block">2- Mercados de crecimiento lento</div>
                                                            <div class="d-block">3- Generan más efectivo del que necesitan para su crecimiento</div>
                                                            <div class="d-block">4- Pueden usarse para desarrollar otros negocios</div>
                                                            <div class="d-block">5- Utilidades significativas</div>
                                                        </div>
                                                    </td>
                                                    <td class="align-top p-0 m-0">
                                                        <div class="mh-350">
                                                            <table class="w-100 bcggeneral listabcg3"></table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_bcg">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 4.Perro -->
                        <div class="tab-pane fade" id="pills-perro" role="tabpanel" aria-labelledby="pills-perro-tab">
                            <div id="perro">
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100 mw-45">
                                        <thead>
                                            <tr>
                                                <th class="w-75"></th>
                                                <th class="text-center"><a href="#!" class="btn btn-success btn-sm agregarbcg" data-index="4">Agregar</a></th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div>
                                        <table class="text-negro table-bordered table-sm w-100 mw-45">
                                            <thead>
                                                <tr>
                                                    <th class="sticky-top color-empresa text-center align-middle w-50">Perro</th>
                                                    <th class="sticky-top color-empresa text-center align-middle"><i class="fas fa-dog fa-lg"></i></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class="bg-piel">
                                                        <div class="m-2">
                                                            <div class="d-block">1- Baja participación en el mercado</div>
                                                            <div class="d-block">2- Mercados de crecimiento lento</div>
                                                            <div class="d-block">3- Pueden generar pocas utilidades o pérdidas</div>
                                                            <div class="d-block">4- Deben reestructurarse o eliminarse estos negocios</div>
                                                        </div>
                                                    </td>
                                                    <td class="align-top p-0 m-0">
                                                        <div class="mh-350">
                                                            <table class="w-100 bcggeneral listabcg4"></table>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_bcg">Grabar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-negro cerrar" type="button">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Principios Corporativos 2 -->
    <div class="modal fade" id="modalprincipios2" tabindex="-1" role="dialog" aria-labelledby="exampleModalprincipios" aria-hidden="true" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title text-negro" id="exampleModalprincipios2">Principios Corporativos</h4>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-negro">
                    <!-- axiologicas -->
                    <div id="axiologicas2">
                        <div class="row">
                            <div class="col-sm-6">
                                <h5>Re-formulación de La matriz axiologica</h5>
                            </div>
                            <div class="col-sm-6">
                                <p>Nota: Colocar un 1 en la celda donde considere que el principio es importante para el grupo de referencia.</p>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <div class="mh-350">
                                <table class="table text-negro table-bordered table-sm w-100 listableaxio2">
                                    <thead>
                                        <tr>
                                            <th class="sticky-top color-empresa w-1"></th>
                                            <th class="sticky-top color-empresa">Principio/grupo</th>
                                            <th class="calculo sticky-top color-empresa">Sociedad</th>
                                            <th class="calculo sticky-top color-empresa">Estado</th>
                                            <th class="calculo sticky-top color-empresa">Familia</th>
                                            <th class="calculo sticky-top color-empresa">Clientes</th>
                                            <th class="calculo sticky-top color-empresa">Proveedores</th>
                                            <th class="calculo sticky-top color-empresa">Colaboradores</th>
                                            <th class="calculo sticky-top color-empresa">Accionistas/dueños</th>
                                            <th class="text-center w-1 sticky-top color-empresa"><a href="#!" class="btn btn-success btn-sm addRowaxio2">Agregar</a></th>
                                        </tr>
                                    </thead>
                                    <tbody class="cuerpo_axiologica2">
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="2" class="sticky-bottom color-empresa"></td>
                                            <td class="text-center align-middle totalcolumna2 sticky-bottom color-empresa">0%</td>
                                            <td class="text-center align-middle totalcolumna3 sticky-bottom color-empresa">0%</td>
                                            <td class="text-center align-middle totalcolumna4 sticky-bottom color-empresa">0%</td>
                                            <td class="text-center align-middle totalcolumna5 sticky-bottom color-empresa">0%</td>
                                            <td class="text-center align-middle totalcolumna6 sticky-bottom color-empresa">0%</td>
                                            <td class="text-center align-middle totalcolumna7 sticky-bottom color-empresa">0%</td>
                                            <td class="text-center align-middle totalcolumna8 sticky-bottom color-empresa">0%</td>
                                            <td class="sticky-bottom color-empresa"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-success" id="btn_axo2">Grabar Axiologicas</button>
                        </div>
                    </div>

                    <hr>
                    <!-- Grupos de Referencia -->
                    <div id="Referencia">
                        <div class="row">
                            <div class="col-sm-6">
                                <h5>Los grupos de referencia</h5>
                            </div>
                            <div class="col-sm-6">
                                <p>Nota: según los resultados defina los principios a seguir con cada grupo de referencia.</p>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table text-negro table-bordered table-sm w-100 listareferencia2">
                                <tbody class="cuerpo_referencia2">
                                </tbody>
                            </table>
                        </div>
                        <div class="d-flex justify-content-end">
                            <button class="btn btn-success" id="btn_referencia2">Grabar Referencias</button>
                        </div>
                    </div>
                    <hr>
                    <!-- Principios corporativos -->
                    <div id="Principios">
                        <div class="row">
                            <div class="col-sm-6">
                                <h5>Los principios corporativos</h5>
                            </div>
                            <div class="col-sm-6">
                                <p>Nota: Enuncie los principios corporativos que deben regir su organización, descríbalos.</p>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table text-negro table-bordered table-sm w-100 listaprincipios2">
                                <thead>
                                    <tr>
                                        <th class="w-75 color-empresa"></th>
                                        <th class="text-center color-empresa"><a href="#!" class="btn btn-success btn-sm agregarprincipios2">Agregar</a></th>
                                    </tr>
                                </thead>
                                <tbody class="cuerpo_principios2">
                                </tbody>
                            </table>
                        </div>
                        <div class="d-flex justify-content-end bg-white">
                            <button class="btn btn-success" id="btn_principios2">Grabar Principios</button>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn btn-negro" type="button" data-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Estrategias -->
    <div class="modal fade modalvalidacion" id="modalestrategias" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-negro" id="exampleModalLabel2">Definición de estrategias de la organización</h5>
                    <button class="close cerrar" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-negro">
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 active" id="pills-integracion-tab" data-toggle="pill" href="#pills-integracion" type="button" role="tab" aria-controls="pills-integracion" aria-selected="true">Integración</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1" id="pills-intensivas-tab" data-toggle="pill" href="#pills-intensivas" type="button" role="tab" aria-controls="pills-intensivas" aria-selected="true">Intensivas</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1" id="pills-diversificacion-tab" data-toggle="pill" href="#pills-diversificacion" type="button" role="tab" aria-controls="pills-diversificacion" aria-selected="true">Diversificación</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1" id="pills-defensivas-tab" data-toggle="pill" href="#pills-defensivas" type="button" role="tab" aria-controls="pills-defensivas" aria-selected="true">Defensivas</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1" id="pills-porter-tab" data-toggle="pill" href="#pills-porter" type="button" role="tab" aria-controls="pills-porter" aria-selected="true">Michael Porter</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1" id="pills-otras-tab" data-toggle="pill" href="#pills-otras" type="button" role="tab" aria-controls="pills-otras" aria-selected="true">Otras</button>
                        </li>
                    </ul>
                    <div class="alerta3"></div>
                    <div class="tab-content" id="pills-tabContent">
                        <!-- 1.Integración -->
                        <div class="tab-pane fade show active" id="pills-integracion" role="tabpanel" aria-labelledby="pills-integracion-tab">
                            <div id="integracion">
                                <div class="container-fluid estrategiatablas estrategiatabla1">
                                    <div class="row text-negro">
                                        <div class="col-xl-2 text-center p-0">
                                            <div class="d-block color-empresa border p-2">Tipo</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Integración</div>
                                        </div>
                                        <div class="col-xl-2 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Nombre</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Hacia delante</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Hacia atrás</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Horizontal</div>
                                        </div>
                                        <div class="col-xl-4 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Explicación</div>
                                            <div class="columnas" data-columna="0" data-tipo="0">
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                            </div>
                                        </div>
                                        <div class="col-xl-4 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Descripción
                                                <a href="#!" class="text-white bg-success rounded m-1 p-1 agregarestrategias text-decoration-none" data-index="1">Agregar</a>
                                            </div>
                                            <div class="mh-350 estrategiavacio estrategiadatos1 columnas" data-columna="1" data-tipo="1"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_estrategias">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 2.Intensivas -->
                        <div class="tab-pane fade" id="pills-intensivas" role="tabpanel" aria-labelledby="pills-intensivas-tab">
                            <div id="intensivas">
                                <div class="container-fluid estrategiatablas estrategiatabla2">
                                    <div class="row text-negro">
                                        <div class="col-xl-2 text-center p-0">
                                            <div class="d-block color-empresa border p-2">Tipo</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Intensivas</div>
                                        </div>
                                        <div class="col-xl-2 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Nombre</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Penetración</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Desarrollo de mercados</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Desarrollo de producto</div>
                                        </div>
                                        <div class="col-xl-4 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Explicación</div>
                                            <div class="columnas" data-columna="0" data-tipo="0">
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                            </div>
                                        </div>
                                        <div class="col-xl-4 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Descripción
                                                <a href="#!" class="text-white bg-success rounded m-1 p-1 agregarestrategias text-decoration-none" data-index="2">Agregar</a>
                                            </div>
                                            <div class="mh-350 estrategiavacio estrategiadatos2 columnas" data-columna="1" data-tipo="1"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_estrategias">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 3.Diversificación -->
                        <div class="tab-pane fade" id="pills-diversificacion" role="tabpanel" aria-labelledby="pills-diversificacion-tab">
                            <div id="intensivas">
                                <div class="container-fluid estrategiatablas estrategiatabla3">
                                    <div class="row text-negro">
                                        <div class="col-xl-2 text-center p-0">
                                            <div class="d-block color-empresa border p-2">Tipo</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Diversificación</div>
                                        </div>
                                        <div class="col-xl-2 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Nombre</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Concentrica</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Horizontal</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Conglomerada</div>
                                        </div>
                                        <div class="col-xl-4 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Explicación</div>
                                            <div class="columnas" data-columna="0" data-tipo="0">
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                            </div>
                                        </div>
                                        <div class="col-xl-4 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Descripción
                                                <a href="#!" class="text-white bg-success rounded m-1 p-1 agregarestrategias text-decoration-none" data-index="3">Agregar</a>
                                            </div>
                                            <div class="mh-350 estrategiavacio estrategiadatos3 columnas" data-columna="1" data-tipo="1"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_estrategias">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 4.Defensivas -->
                        <div class="tab-pane fade" id="pills-defensivas" role="tabpanel" aria-labelledby="pills-defensivas-tab">
                            <div id="intensivas">
                                <div class="container-fluid estrategiatablas estrategiatabla4">
                                    <div class="row text-negro">
                                        <div class="col-xl-2 text-center p-0">
                                            <div class="d-block color-empresa border p-2">Tipo</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Defensivas</div>
                                        </div>
                                        <div class="col-xl-2 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Nombre</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Riesgo compartido</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Encogimiento</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Desinversión</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Liquidación</div>
                                        </div>
                                        <div class="col-xl-4 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Explicación</div>
                                            <div class="columnas" data-columna="0" data-tipo="0">
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                            </div>
                                        </div>
                                        <div class="col-xl-4 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Descripción
                                                <a href="#!" class="text-white bg-success rounded m-1 p-1 agregarestrategias text-decoration-none" data-index="4">Agregar</a>
                                            </div>
                                            <div class="mh-350 estrategiavacio estrategiadatos4 columnas" data-columna="1" data-tipo="1"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_estrategias">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 5.Michael Porter -->
                        <div class="tab-pane fade" id="pills-porter" role="tabpanel" aria-labelledby="pills-porter-tab">
                            <div id="porter">
                                <div class="container-fluid estrategiatablas estrategiatabla5">
                                    <div class="row text-negro">
                                        <div class="col-xl-2 text-center p-0">
                                            <div class="d-block color-empresa border p-2">Tipo</div>
                                            <div class="rounded-0 form-control form-control-sm pb-5 text-negro">Estrategias según Michael Porter</div>
                                        </div>
                                        <div class="col-xl-3 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Nombre</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Economias de escala</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Diferenciación de producto</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Inversión de capital</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Costos independientes de escala</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Acceso a canales de distribución</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Politicas gubernamentales</div>
                                        </div>
                                        <div class="col-xl-3 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Explicación</div>
                                            <div class="columnas" data-columna="0" data-tipo="0">
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                                <input class="rounded-0 form-control form-control-sm general" />
                                            </div>
                                        </div>
                                        <div class="col-xl-4 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Descripción
                                                <a href="#!" class="text-white bg-success rounded m-1 p-1 agregarestrategias text-decoration-none" data-index="5">Agregar</a>
                                            </div>
                                            <div class="mh-350 estrategiavacio estrategiadatos5 columnas" data-columna="1" data-tipo="1"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_estrategias">Grabar</button>
                                </div>
                            </div>
                        </div>
                        <!-- 6.Otras -->
                        <div class="tab-pane fade" id="pills-otras" role="tabpanel" aria-labelledby="pills-otras-tab">
                            <div id="otras">
                                <div class="container-fluid estrategiatablas estrategiatabla6">
                                    <div class="row text-negro">
                                        <div class="col-xl-2 text-center p-0">
                                            <div class="d-block color-empresa border p-2">Tipo</div>
                                            <div class="rounded-0 form-control form-control-sm text-negro">Otras estrategias</div>
                                        </div>
                                        <div class="col-xl-3 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Nombre
                                                <a href="#!" class="text-white bg-success rounded m-1 p-1 agregarestrategias text-decoration-none" data-index="6">Agregar</a>
                                            </div>
                                            <div class="mh-350 estrategiavacio estrategiadatos6 columnas" data-columna="0" data-tipo="1"></div>
                                        </div>
                                        <div class="col-xl-3 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Explicación
                                                <a href="#!" class="text-white bg-success rounded m-1 p-1 agregarestrategias text-decoration-none" data-index="7">Agregar</a>
                                            </div>
                                            <div class="mh-350 estrategiavacio estrategiadatos7 columnas" data-columna="1" data-tipo="1"></div>
                                        </div>
                                        <div class="col-xl-4 p-0">
                                            <div class="d-block color-empresa border text-center p-2">Descripción
                                                <a href="#!" class="text-white bg-success rounded m-1 p-1 agregarestrategias text-decoration-none" data-index="8">Agregar</a>
                                            </div>
                                            <div class="mh-350 estrategiavacio estrategiadatos8 columnas" data-columna="2" data-tipo="1"></div>
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_estrategias">Grabar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-negro cerrar" type="button">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal Futuro -->
    <div class="modal fade modalvalidacion" id="modalmando" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-negro" id="exampleModalLabel2">Definición de estrategias de la organización</h5>
                    <button class="close cerrar" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body text-negro">
                    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1 active" id="pills-futuro-tab" data-toggle="pill" href="#pills-futuro" type="button" role="tab" aria-controls="pills-futuro" aria-selected="true">Plan de futuro</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1" id="pills-politica-tab" data-toggle="pill" href="#pills-politica" type="button" role="tab" aria-controls="pills-politica" aria-selected="true">Política de gestión</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1" id="pills-promesa-tab" data-toggle="pill" href="#pills-promesa" type="button" role="tab" aria-controls="pills-promesa" aria-selected="true">Promesa de servicio</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="btn color-empresa m-1" id="pills-objetivos-tab" data-toggle="pill" href="#pills-objetivos" type="button" role="tab" aria-controls="pills-objetivos" aria-selected="true">Objetivos estratégicos y/o estrategias</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button type="button" class="btn color-empresa m-1 dropdown-toggle bcg_reportes" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Reportes
                            </button>
                            <div class="dropdown-menu p-0">
                                <a class="dropdown-item futuro_reporte" data-reporte="pdf" href="#!">PDF</a>
                                <a class="dropdown-item futuro_reporte" data-reporte="excel" href="#!">Excel</a>
                            </div>
                        </li>
                    </ul>
                    <div class="alerta4"></div>
                    <div class="tab-content" id="pills-tabContent">
                        <!-- 1.Plan de futuro -->
                        <div class="tab-pane fade show active" id="pills-futuro" role="tabpanel" aria-labelledby="pills-integracion-tab">
                            <div id="futuro">
                                <div class="container-fluid futurogeneral futurotabla0">
                                    <div class="row">
                                        <div class="col-lg-4 p-0">
                                            <div class="d-block color-empresa text-center border">Misión</div>
                                            <div class="d-block campo"><textarea class="form-control m-0 rounded-0 shadow-none general" rows="7"></textarea></div>
                                        </div>
                                        <div class="col-lg-4 p-0">
                                            <div class="d-block color-empresa text-center border">Visión</div>
                                            <div class="d-block campo"><textarea class="form-control m-0 rounded-0 shadow-none general" rows="7"></textarea></div>
                                        </div>
                                        <div class="col-lg-4 p-0">
                                            <div class="d-block color-empresa text-center border">Valores</div>
                                            <div class="d-block campo"><textarea class="form-control m-0 rounded-0 shadow-none general" rows="7"></textarea></div>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-end bg-white mt-2">
                                        <button class="btn btn-success grabar_futuro">Grabar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 2.Politica de gestión -->
                        <div class="tab-pane fade" id="pills-politica" role="tabpanel" aria-labelledby="pills-politica-tab">
                            <div class="table-responsive">
                                <table class="table text-negro table-bordered table-sm w-100 futurogeneral futurotabla1">
                                    <thead>
                                        <tr>
                                            <th class="w-75 color-empresa align-middle text-center">Política de gestión</th>
                                            <th class="text-center color-empresa"><a href="#!" class="btn btn-success btn-sm agregarfuturo" data-index="1">Agregar</a></th>
                                        </tr>
                                    </thead>
                                    <tbody class="cuerpo">
                                    </tbody>
                                </table>
                            </div>
                            <div class="d-flex justify-content-end bg-white">
                                <button class="btn btn-success grabar_futuro">Grabar</button>
                            </div>
                        </div>
                        <!-- 3.Promesa de servicio -->
                        <div class="tab-pane fade" id="pills-promesa" role="tabpanel" aria-labelledby="pills-promesa-tab">
                            <div class="table-responsive">
                                <table class="table text-negro table-bordered table-sm w-100 futurogeneral futurotabla2">
                                    <thead>
                                        <tr>
                                            <th class="w-75 color-empresa align-middle text-center">Promesa de servicio</th>
                                            <th class="text-center color-empresa"><a href="#!" class="btn btn-success btn-sm agregarfuturo" data-index="2">Agregar</a></th>
                                        </tr>
                                    </thead>
                                    <tbody class="cuerpo">
                                    </tbody>
                                </table>
                            </div>
                            <div class="d-flex justify-content-end bg-white">
                                <button class="btn btn-success grabar_futuro">Grabar</button>
                            </div>
                        </div>
                        <!-- 4.Objetivos estrategicos y/o estrategias -->
                        <div class="tab-pane fade" id="pills-objetivos" role="tabpanel" aria-labelledby="pills-objetivos-tab">
                            <div id="objetivos">
                                <p>Instrucción: Transfiera las estrategias descritas y/o definidas en el cuadro de DEFINICION DE ESTRATEGIAS DE LA ORGANIZACIÓN a la celda que corresponda según la perspectiva del Balanced Scorecard.</p>
                                <div class="table-responsive">
                                    <table class="text-negro table-bordered table-sm w-100">
                                        <thead>
                                            <tr>
                                                <th class="w-100">Objetivos estrategicos y/o estrategias</th>
                                            </tr>
                                        </thead>
                                    </table>
                                    <div>
                                        <table class="text-negro table-bordered table-sm listaobjetivos w-100 mw-45">
                                            <thead>
                                                <tr>
                                                    <th colspan="2" class="sticky-top color-empresa text-center w-25">Perspectiva de talento humano</th>
                                                    <th colspan="2" class="sticky-top color-empresa text-center w-25">Perspectiva de procesos internos</th>
                                                    <th colspan="2" class="sticky-top color-empresa text-center w-25">Perspectiva de cliente</th>
                                                    <th colspan="2" class="sticky-top color-empresa text-center w-25">Perspectiva financiera</th>
                                                </tr>
                                            </thead>
                                            <tbody class="cuerpo_objetivos"></tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-end bg-white mt-2">
                                    <button class="btn btn-success grabar_objetivos">Grabar</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-negro cerrar" type="button">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal CMI -->
    <div class="modal fade modalvalidacion modal-fullscreen" id="modalcmi" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true" data-keyboard="false" data-backdrop="static">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-negro" id="exampleModalLabel2">Tablero de indicadores</h5>
                    <button class="close cerrar" type="button" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="alertacmi"></div>
                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text text-negro" id="basic-addon3">Seleccione el año a editar</span>
                        </div>
                        <input id="anio_tabla" class="form-control form-control anio_tabla col-3 bg-white" type="number" min="1900" max="2099" step="1">
                        <div class="input-group-append">
                            <button class="btn color-empresa dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Reportes</button>
                            <div class="dropdown-menu p-0">
                                <a class="dropdown-item cmi_reporte" data-reporte="pdf" href="#!">PDF</a>
                                <a class="dropdown-item cmi_reporte" data-reporte="excel" href="#!">Excel</a>
                            </div>
                        </div>
                    </div>
                    <div class="container-fluid table-responsive indicadortablas indicadorestabla1">
                        <div class="row flex-nowrap text-negro header">
                            <div class="col p-0 mw-2600">
                            </div>
                            <div class="col p-0 mw-600">
                                <div class="d-block color-empresa border p-2 text-center">
                                    <span>Meta</span>
                                    <a href="#!" class="text-success bg-white rounded p-1 agregarindicadores text-decoration-none" data-index="7" data-type="metas"><i class="fa fa-plus"></i></a>
                                </div>
                            </div>
                            <div class="col p-0 mw-2400">
                                <div class="d-block color-empresa border p-2 text-center">
                                    <span>Año <span class="anio_indicador"></span></span>
                                    <a href="#!" class="text-success bg-white rounded p-1 agregarindicadores text-decoration-none" data-index="8" data-type="anios"><i class="fa fa-plus"></i></a>
                                </div>
                            </div>
                        </div>
                        <div class="row flex-nowrap  text-negro">
                            <!--Direccionamiento estratégico-->
                            <div class="col text-center p-0 mw-600">
                                <div class="d-block color-empresa border p-2">
                                    <span>Direccionamiento estratégico</span>
                                    <a href="#!" class="text-success bg-white rounded p-1 agregarindicadores text-decoration-none" data-index="1" data-type="estra"><i class="fa fa-plus"></i></a>
                                </div>
                                <div class="indicadorvacioespecial0 vacio indicadordatos1 columnas2" data-columna="1" data-tipo="1"></div>
                            </div>
                            <!--Directriz de política-->
                            <div class="col p-0 mw-400">
                                <div class="d-block color-empresa border text-center p-2">
                                    <span>Directriz de política</span>
                                    <a href="#!" class="text-success bg-white rounded p-1 agregarindicadores text-decoration-none" data-index="2" data-type="1"><i class="fa fa-plus"></i></a>
                                </div>
                                <div class="indicadorvacio vacio indicadordatos2 columnas" data-columna="2" data-tipo="1"></div>
                            </div>
                            <!--Objetivo de gestión-->
                            <div class="col p-0 mw-400">
                                <div class="d-block color-empresa border text-center p-2">
                                    <span>Objetivo de gestión</span>
                                    <a href="#!" class="text-success bg-white rounded p-1 agregarindicadores text-decoration-none" data-index="3" data-type="1"><i class="fa fa-plus"></i></a>
                                </div>
                                <div class="indicadorvacio vacio indicadordatos3 columnas" data-columna="3" data-tipo="1"></div>
                            </div>
                            <!--Proceso-->
                            <div class="col p-0 mw-400">
                                <div class="d-block color-empresa border text-center p-2">
                                    <span>Proceso</span>
                                    <a href="#!" class="text-success bg-white rounded p-1 agregarindicadores text-decoration-none" data-index="4" data-type="1"><i class="fa fa-plus"></i></a>
                                </div>
                                <div class="indicadorvacio vacio indicadordatos4 columnas" data-columna="4" data-tipo="1"></div>
                            </div>
                            <!--Indicador-->
                            <div class="col p-0 mw-400">
                                <div class="d-block color-empresa border text-center p-2">
                                    <span>Indicador</span>
                                    <a href="#!" class="text-success bg-white rounded p-1 agregarindicadores text-decoration-none" data-index="5" data-type="1"><i class="fa fa-plus"></i></a>
                                </div>
                                <div class="indicadorvacio vacio indicadordatos5 columnas" data-columna="5" data-tipo="1"></div>
                            </div>
                            <!--Fórmula-->
                            <div class="col p-0 mw-400">
                                <div class="d-block color-empresa border text-center p-2">
                                    <span>Fórmula</span>
                                    <a href="#!" class="text-success bg-white rounded p-1 agregarindicadores text-decoration-none" data-index="6" data-type="1"><i class="fa fa-plus"></i></a>
                                </div>
                                <div class="indicadorvacio vacio indicadordatos6 columnas" data-columna="6" data-tipo="1"></div>
                            </div>
                            <!--Meta-->
                            <div class="col p-0 mw-600">
                                <div class="d-block color-empresa border text-center">
                                    <div class="row no-gutters">
                                        <div class="col-4 bg-verde text-negro p-2">Sobresaliente</div>
                                        <div class="col-4 bg-amarillo text-negro p-2">Normal (Meta)</div>
                                        <div class="col-4 bg-red p-2">Deficiente</div>
                                    </div>
                                </div>
                                <div class="indicadorvacioespecial1 vacio indicadordatos7 columnas2" data-columna="7" data-tipo="1"></div>
                            </div>
                            <!--Promedio año-->
                            <div class="col p-0 mw-2400">
                                <div class="d-block color-empresa border text-center">
                                    <div class="row no-gutters">
                                        <div class="col p-2 border-right">Enero</div>
                                        <div class="col p-2 border-right">Febrero</div>
                                        <div class="col p-2 border-right">Marzo</div>
                                        <div class="col p-2 border-right">Abril</div>
                                        <div class="col p-2 border-right">Mayo</div>
                                        <div class="col p-2 border-right">Junio</div>
                                        <div class="col p-2 border-right">Julio</div>
                                        <div class="col p-2 border-right">Agosto</div>
                                        <div class="col p-2 border-right">Septiembre</div>
                                        <div class="col p-2 border-right">Octubre</div>
                                        <div class="col p-2 border-right">Noviembre</div>
                                        <div class="col p-2 border-right">Diciembre</div>
                                        <div class="col p-2 ">Promedio</div>
                                    </div>
                                </div>
                                <div class="indicadorvacioespecial2 vacio indicadordatos8 columnas2" data-columna="8" data-tipo="1"></div>
                            </div>
                        </div>
                        <div class="row flex-nowrap text-negro pie">
                            <div class="col p-0 mw-3200">
                            </div>
                            <div class="col p-0 mw-2400">
                                <div class="d-block border text-center">
                                    <div class="row no-gutters">
                                        <div class="col p-1 border pos0 bg-red">0%</div>
                                        <div class="col p-1 border pos1 bg-red">0%</div>
                                        <div class="col p-1 border pos2 bg-red">0%</div>
                                        <div class="col p-1 border pos3 bg-red">0%</div>
                                        <div class="col p-1 border pos4 bg-red">0%</div>
                                        <div class="col p-1 border pos5 bg-red">0%</div>
                                        <div class="col p-1 border pos6 bg-red">0%</div>
                                        <div class="col p-1 border pos7 bg-red">0%</div>
                                        <div class="col p-1 border pos8 bg-red">0%</div>
                                        <div class="col p-1 border pos9 bg-red">0%</div>
                                        <div class="col p-1 border pos10 bg-red">0%</div>
                                        <div class="col p-1 border pos11 bg-red">0%</div>
                                        <div class="col p-1 pos12 bg-red">0%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row flex-nowrap text-negro pietotal mb-2">
                            <div class="col p-0 mw-3200">
                            </div>
                            <div class="col p-0 mw-2400">
                                <div class="d-block text-center">
                                    <div class="row no-gutters">
                                        <div class="col p-1"></div>
                                        <div class="col p-1"></div>
                                        <div class="col p-1"></div>
                                        <div class="col p-1"></div>
                                        <div class="col p-1"></div>
                                        <div class="col p-1"></div>
                                        <div class="col p-1"></div>
                                        <div class="col p-1"></div>
                                        <div class="col p-1"></div>
                                        <div class="col p-1"></div>
                                        <div class="col-3 mxw-23 border p-1 bg-red cmi_total">0%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-negro cerrar" type="button">Cerrar</button>
                    <button class="btn btn-success grabar_cmi" type="button">Grabar</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal salir -->
    <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel2" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel2">¿Realmente quiere salir?</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">Seleccione "Salir" si está listo para finalizar su sesión actual.</div>
                <div class="modal-footer">
                    <button class="btn btn-negro" type="button" data-dismiss="modal">Cancelar</button>
                    <a class="btn btn-red" href="iniciosesion.php">Salir</a>
                </div>
            </div>
        </div>
    </div>
    <script src="../vendor/jquery/jquery-3.3.1.min.js"></script>
    <script src="../vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="../vendor/jquery-easing/jquery.easing.min.js"></script>
    <script src="../css/dist/sweetalert.js"></script>
    <script src="js/menu.js?v=2" type="text/javascript"></script>
    <script src="../js/sb-admin-2.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.4/js/bootstrap-datepicker.js"></script>
    <script src="js/usuario/gestionusuario.js?v=<?php echo uniqid(); ?>" type="text/javascript"></script>

</body>

</html>
