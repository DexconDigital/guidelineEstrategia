/* global app */
var usuarioModelo = {
    listaUsuario: [],
    listaBCG: [],
    listaFuturo: [],
    listaObjetivos: [],
    listaIndicadores: [],
    listaDofa: [],
    textocolor: "",
    cambios: 0,
    pos: -1
};
var gestionUsuario = {
    constructor: function () {
        gestionUsuario.consultadatos();
        $('#btnmodificar_empresa').on('click', gestionUsuario.modificar_empresa);
        $('#btn_axo').on('click', gestionUsuario.agregar_axiologicas);
        $('#btn_referencia').on('click', gestionUsuario.agregar_referencia);
        $('#btn_principios').on('click', gestionUsuario.agregar_principios);
        $('#btn_mision').on('click', gestionUsuario.agregar_mision);
        $('#btn_vision').on('click', gestionUsuario.agregar_vision);
        $('.grabarprocesos').on('click', gestionUsuario.agregar_procesos);
        $('#btn_dofa').on('click', gestionUsuario.agregar_Dofaresumido);
        $('.grabar_dofaana').on('click', gestionUsuario.agregar_Dofaanalisis);
        $('.estrategias').on('click', gestionUsuario.consultarEstrategias);
        $('#grabar_seguimiento').on('click', gestionUsuario.agregar_Seguimiento);
        $('#grabar_fuerzas').on('click', gestionUsuario.agregar_Fuerzas);
        $('.grabar_bcg').on('click', gestionUsuario.agregar_BCG);
        $('#btn_axo2').on('click', gestionUsuario.agregar_axiologicas2);
        $('#btn_referencia2').on('click', gestionUsuario.agregar_referencia2);
        $('#btn_principios2').on('click', gestionUsuario.agregar_principios2);
        $('#pci, #poam, #dofa, #dofaana').on('click', gestionUsuario.consultadatosDiagnostico);
        $('.grabar_futuro').on('click', gestionUsuario.agregar_Futuro);
        $('.grabar_objetivos').on('click', gestionUsuario.agregar_Objetivos);
        $('.grabar_cmi').on('click', gestionUsuario.agregar_CMI);
        $('#usuarios').on('click', gestionUsuario.consultardatosUsuarios);
        gestionUsuario.modalCambiosDiagnostico();
        $('[data-toggle="popover"]').popover();
        $('.yearpicker').datepicker({
            minViewMode: 2,
            format: 'yyyy'
        });
        //PCI conjunto
        $('.grabar_pci').click(function (e) {
            e.stopImmediatePropagation();
            var pos = $(this).attr("data-index");
            gestionUsuario.agregar_diagnostico("pci", pos);
        });
        //POAM conjunto
        $('.grabar_poam').click(function (e) {
            e.stopImmediatePropagation();
            var pos = $(this).attr("data-index");
            gestionUsuario.agregar_diagnostico("poam", pos);
        });
        $('.grabar_estrategias').click(function (e) {
            e.stopImmediatePropagation();
            gestionUsuario.agregar_EstrategiasGeneral();
        });

    },
    consultadatos: function (e) {
        var data = {};
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=consultar_datos', data, gestionUsuario.respuestaConsultadatos);
    },
    respuestaConsultadatos: function (respuesta) {
        usuarioModelo.listaUsuario = respuesta.datos;
        var datos = usuarioModelo.listaUsuario;
        $('#frm_empresa1').trigger("reset");
        $('.loader').fadeOut();
        $('body').css('overflow', 'visible');
        if (datos.usuario !== "Dexcon") {
            $('#usuarios').remove();
        }
        //cargar empresa
        gestionUsuario.datosempresa(datos);
        //cargar estrategas
        gestionUsuario.datosestrategas(datos);
        //cargar axiologicas
        gestionUsuario.datosaxiologica(datos);
        //cargar referencia
        gestionUsuario.datosreferencia(datos);
        //cargar principios
        gestionUsuario.datosprincipios(datos);
        //cargar procesos
        gestionUsuario.datosprocesos(datos);
        //color de la empresa 
        gestionUsuario.coloresGeneral(datos);
        //Calendario seguimientos 
        gestionUsuario.calendarioSeguimientos(datos);
    },
    calendarioSeguimientos: function (datos) {
        var seg = datos.seguimientos;
        var eventos = [];
        for (var i = 0; i < seg.length; i++) {
            eventos.push({
                title: seg[i][0],
                start: seg[i][3]
            })
        }
        $('#calendario').fullCalendar("destroy");
        $('#calendario').fullCalendar({
            locale: 'es',
            header: {
                left: 'prev,next,today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            events: eventos,
            eventTextColor: usuarioModelo.textocolor,
            eventColor: datos.color,
            eventAfterRender: function (event, element) {
                $(element).tooltip({
                    title: event.title,
                    container: "body"
                });
            }
        });
    },
    consultardatosUsuarios: function (e) {
        var data = {
            'usuario': usuarioModelo.listaUsuario.usuario
        };
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=consultar_usuarios', data, gestionUsuario.respuestaconsultadatosUsuario);
    },
    respuestaconsultadatosUsuario: function (respuesta) {
        var datos = respuesta.datos;
        var cards_deck = '<div class="row">';
        for (var pos = 0; pos < datos.length; pos++) {
            var campo = datos[pos];
            cards_deck += '<div class="col-sm-6 card bg-gradient-primary text-light">' +
                '<div class="card-body">';
            if (pos != 0) {
                cards_deck += '<button type="button" class="close eliminar text-light" aria-label="Close" data-id="' + campo.id_admin + '">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>';
            }

            cards_deck += '<h5 class="card-title">' + campo.usuario + '</h5>' +
                '<div class="input-group input-group-sm">' +
                '<input type="text" class="form-control general" value="' + campo.clave + '">' +
                '<div class="input-group-append">' +
                '<button class="btn btn-success cambiar" data-id="' + campo.id_admin + '" type="button">Cambiar</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        cards_deck += '<div class="col-sm-6 card border border-primary">' +
            '<a class="crear my-auto" href="#">' +
            '<i class="fas fa-plus-circle fa-2x"></i>' +
            '</a>' +
            '</div>';
        cards_deck += '</div>';
        Swal.fire({
            width: '1000px',
            position: 'top',
            allowOutsideClick: false,
            showCloseButton: true,
            title: 'Lista de usuarios',
            showConfirmButton: false,
            html: cards_deck
        })
        //Actualizar contraseña
        $('.cambiar').click(function (e) {
            e.stopImmediatePropagation();
            var idx = $(this).attr("data-id");
            var clave = $(this).parent().parent().find("input").val();
            var data = {
                'clave': clave,
                'idx': idx
            }
            app.ajax('../controlador/GestionUsuarioControlador.php?opcion=actualizar_usuario', data, gestionUsuario.respuestaGeneral);
        });
        //Crear usuario
        $('.crear').click(function (e) {
            e.stopImmediatePropagation();
            Swal.fire({
                html: 'Usuario:<input type="text" id="usuario" class="form-control form-control-sm">' +
                    'Clave:<input type="text" id="clave" class="form-control form-control-sm">',
                position: 'top',
                title: 'Crear usuario',
                showCloseButton: true,
                confirmButtonColor: "#71c904",
                confirmButtonText: "Agregar"
            }).then(function (result) {
                if (result.isConfirmed) {
                    var usuario = $('#usuario').val();
                    var clave = $('#clave').val();
                    var data = {
                        'usuario': usuario,
                        'clave': clave,
                    };
                    app.ajax('../controlador/GestionUsuarioControlador.php?opcion=crear_usuario', data, gestionUsuario.respuestaGeneral);
                }
            })
        });
        //Elimiar usuario
        $('.eliminar').click(function (e) {
            e.stopImmediatePropagation();
            var idx = $(this).attr("data-id");
            var data = {
                'idx': idx
            }
            app.ajax('../controlador/GestionUsuarioControlador.php?opcion=eliminar_usuario', data, gestionUsuario.respuestaGeneral);
        });
    },
    datosempresa: function (datos) {
        //logo
        if (datos.logo != null || datos.logo != "") {
            $('#img_logo').attr("src", datos.logo);
        }
        if (datos.logo == null || datos.logo == "") {
            $('#img_logo').attr("src", "../img/logo.png");
        }
        $('#titulo_empresa, #nombre_empresa').text(datos.razon_social);
        $('#nit').val(datos.nit);
        $('#razon_social').val(datos.razon_social);
        $('#fecha').val(datos.fecha);
        $('#horizonte_inicial').datepicker('setDate', datos.horizonte_inicial);
        $('#horizonte_final').datepicker('setDate', datos.horizonte_final);
        $('#horizonte_noanios').val(datos.horizonte_noanios);
        $('#color').val(datos.color);
        $('#vision_text').val(datos.vision);
        $('#mision_text').val(datos.mision);
        $('.yearpicker').change(function (e) {
            e.stopImmediatePropagation();
            var horizonte_inicial = $('#horizonte_inicial').val();
            var horizonte_final = $('#horizonte_final').val();
            var total = horizonte_final - horizonte_inicial;
            if (horizonte_inicial > horizonte_final) {
                $('.msg1').html('<div class="alert alert-warning alert-dismissible fade show" role="alert"><strong>Advertencia</strong> El horizonte inicial no debe ser mayor al horizonte final.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
            } else {
                $('.msg1').html("");
            }
            $('#horizonte_noanios').val(total);
        });
    },
    datosestrategas: function (datos) {
        var estrategas_general = datos.estrategas;
        //cargar estrategas
        if (estrategas_general != "" && estrategas_general != null) {
            var tabla_estrategas = $('#cuerpo_estrategas');
            tabla_estrategas.empty();
            var estrategas = estrategas_general.split("|");
            for (var e = 0; e < estrategas.length; e++) {
                var estratega = estrategas[e];
                var tr = '<tr class="cb" id="row_' + e + '">';
                tr += '<td><input type="text" name="pos" id="pos_' + e + '" class="form-control form-control-sm estratega" value="' + estratega + '"></td>';
                tr += '<td class="text-center"><a href="#" class="btn btn-danger btn-sm remove">Remover</a>';
                tr += '</td></tr>';
                $('#cuerpo_estrategas').append(tr);
            }
        }
        //añadir nuevos estrategas
        var i = 0;
        $('.addRow').on('click', function (e) {
            e.stopImmediatePropagation();
            var rowCount = $('.listable tr').length - 1;
            var tr = '<tr class="cb" id="row_' + rowCount + '">';
            tr += '<td><input type="text" name="pos" id="pos_' + rowCount + '" class="form-control form-control-sm estratega"></td>';
            tr += '<td class="text-center"><a href="#" class="btn btn-danger btn-sm remove">Remover</a>';
            tr += '</td></tr>';
            i++;
            $('#cuerpo_estrategas').append(tr);
        });

        //remover estrategas
        $('#cuerpo_estrategas').on('click', '.remove', function () {
            $(this).parent().parent().remove();
        });
    },
    datosaxiologica: function (datos) {
        var axiologica_general = datos.axiologica;
        var tabla_axiologica = $('.cuerpo_axiologica');
        //cargar axiologicas
        if (axiologica_general != null && axiologica_general != "") {
            tabla_axiologica.empty();
            for (var a = 0; a < axiologica_general.length; a++) {
                var axiologicas = axiologica_general[a];
                var tr = gestionUsuario.campostablaAxiologica(axiologicas);
                tabla_axiologica.append(tr);
            }
        } else {
            tabla_axiologica.empty();
            var axiologicas = ["", "", "", "", "", "", "", ""]
            var tr = gestionUsuario.campostablaAxiologica(axiologicas);
            tabla_axiologica.append(tr);
        }
        //añadir axiologicas
        $('.addRowaxio').on('click', function (e) {
            e.stopImmediatePropagation();
            var axiologicas = ["", "", "", "", "", "", "", ""]
            var tr = gestionUsuario.campostablaAxiologica(axiologicas);
            tabla_axiologica.append(tr);
            gestionUsuario.imprimiraxiologica("listableaxio");
        });
        //restringir caracteres axiologicas
        $('.axo-general').keypress(function (tecla) {
            if ((tecla.charCode == 124 || tecla.charCode == 8226)) return false;
        });
        //calcular axiologicas
        gestionUsuario.imprimiraxiologica("listableaxio");
        //remover axiologicas
        tabla_axiologica.on('click', '.remove', function () {
            $(this).parent().parent().remove();
            gestionUsuario.imprimiraxiologica("listableaxio");
        });
    },
    campostablaAxiologica: function (axiologicas) {
        var tr = '<tr>';
        tr += '<td class="w-1 align-middle"><a href="#" class="text-danger remove"><i class="fa fa-trash"></i></a></td>';
        tr += '<td class="align-middle">' +
            '<input class="form-control form-control-sm axo-general" data-pos="0" value="' + axiologicas[0] + '" >' +
            '</td>';
        for (var pos = 1; pos <= 7; pos++) {
            var selected = (axiologicas[pos]) ? "selected" : "";
            tr += '<td class="align-middle">' +
                '<select class="form-control text-center form-control-sm axo-data axo-general mb-0" data-pos="' + pos + '">' +
                '<option value=""></option>' +
                '<option value="1" ' + selected + '>1</option>' +
                '</select>' +
                '</td>';
        }
        tr += '<td class="text-center align-middle w-1 total_fila">0%</td>';
        tr += '</tr>';
        //Devuelve una fila
        return tr;
    },
    datosreferencia: function (datos) {
        var referencia_general = datos.referencia;
        var referencia = ["Sociedad", "Estado", "Familia", "Clientes", "Proveedores", "Colaboradores", "Accionistas"];
        var referencia_datos = [];
        if (referencia_general != null && referencia_general != "") {
            referencia_datos = referencia_general.split("|");
        }
        //cargar referencia
        var cuerpo_referencia = $('.cuerpo_referencia');
        cuerpo_referencia.empty();
        for (var pos = 0; pos < 7; pos++) {
            var valor = (referencia_datos.length != 0) ? referencia_datos[pos] : "";
            var tr = '<tr>' +
                '<td class="align-middle w-25 color-empresa">' + referencia[pos] + '</td>' +
                '<td class="align-middle"><input class="form-control form-control-sm referencia_general" value="' + valor + '" /></td>' +
                '</tr>';
            cuerpo_referencia.append(tr);
        }
    },
    datosprincipios: function (datos) {
        var principios_general = datos.principio;
        var cuerpo_principios = $('.cuerpo_principios');
        //cargar principios
        if (principios_general != null && principios_general != "") {
            cuerpo_principios.empty();
            var principios_datos = principios_general.split("|");
            for (var pos = 0; pos < principios_datos.length; pos++) {
                var valor = principios_datos[pos];
                var tr = gestionUsuario.camposprincipios(valor);
                cuerpo_principios.append(tr);
            }
        } else {
            cuerpo_principios.empty();
            var valor = "";
            var tr = gestionUsuario.camposprincipios(valor);
            cuerpo_principios.append(tr);
        }
        //añadir nuevos principios
        $('.agregarprincipios').on('click', function (e) {
            e.stopImmediatePropagation();
            var valor = "";
            var tr = gestionUsuario.camposprincipios(valor);
            cuerpo_principios.append(tr);
        });
        //remover principios
        cuerpo_principios.on('click', '.remove', function () {
            $(this).parent().parent().remove();
        });
    },
    camposprincipios: function (campo) {
        var tr = '<tr>' +
            '<td class="align-middle"><input class="form-control form-control-sm principios_general" value="' + campo + '" /></td>' +
            '<td class="text-center"><a href="#" class="btn btn-danger btn-sm remove">Remover</a>' +
            '</tr>';
        return tr;
    },
    imprimiraxiologica: function (tabla) {
        gestionUsuario.calcularaxiologica(tabla);
        $("." + tabla + " tbody tr").change(function () {
            gestionUsuario.calcularaxiologica(tabla);
        });
    },
    calcularaxiologica: function (tabla) {
        //Calcular columnas
        var totalrow = $('.' + tabla + ' tbody tr').length;
        var variablelista = {
            "suma2": 0,
            "suma3": 0,
            "suma4": 0,
            "suma5": 0,
            "suma6": 0,
            "suma7": 0,
            "suma8": 0
        };
        $('.' + tabla + ' tbody tr td').each(function () {
            for (var pos = 2; pos <= 8; pos++) {
                if ($(this).index() == pos) {
                    variablelista["suma" + pos] += parseFloat($(this).find('.axo-data option:selected').val()) || 0;
                }
            }
        });
        //calcular logica columnas de cada una de las axiologicas
        for (var pos = 2; pos <= 8; pos++) {
            var total = (((variablelista["suma" + pos]) / totalrow) * 100);
            var totalgeneral = parseInt(total) + "%";
            $('.' + tabla + ' tfoot tr td.totalcolumna' + pos).html(totalgeneral)
        };
        //Calcular fila
        $('.' + tabla + ' tr:has(td):not(:last)').each(function () {
            var sum = 0;
            var cantfilas = 7;
            $(this).find('td').each(function () {
                sum += parseFloat($(this).find('.axo-data option:selected').val()) || 0;
            });
            var tot = (sum / cantfilas) * 100;
            var totalgeneral = parseInt(tot) + "%";
            $(this).find('td:last').html(totalgeneral);
        });
    },
    modificar_empresa: function (e) {
        e.preventDefault();
        var formulario = $('#frm_empresa1');
        var nit = $('#nit').val();
        var razon_social = $('#razon_social').val();
        var fecha = $('#fecha').val();
        var horizonte_inicial = $('#horizonte_inicial').val();
        var horizonte_final = $('#horizonte_final').val();
        var horizonte_noanios = $('#horizonte_noanios').val();
        var color = $('#color').val();
        var logo = $('#logo').prop('files')[0];
        var dat = $("#cuerpo_estrategas .estratega").serialize();
        var estra = dat.split("&pos=").join("|");
        var estra_espacio = estra.replace(/%7C/g, '');
        var estrategas = estra_espacio.replace("pos=", "");
        if (horizonte_inicial > horizonte_final) {
            $('.msg1').html('<div class="alert alert-warning alert-dismissible fade show" role="alert"><strong>Advertencia</strong> El horizonte inicial no debe ser mayor al horizonte final.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
        } else {
            $('.msg1').html("");
            var data = new FormData();
            data.append('id_empresa', usuarioModelo.listaUsuario.id_empresa);
            data.append('nit', nit);
            data.append('razon_social', razon_social);
            data.append('fecha', fecha);
            data.append('horizonte_inicial', horizonte_inicial);
            data.append('horizonte_final', horizonte_final);
            data.append('horizonte_noanios', horizonte_noanios);
            data.append('color', color);
            data.append('logo', logo);
            data.append('estrategas', decodeURIComponent(estrategas));
            app.ajaximg('../controlador/GestionUsuarioControlador.php?opcion=modificar_empresa', data, gestionUsuario.respuestaEmpresaimg);
        }
    },
    datosprocesos: function (datos) {
        var procesos_general = datos.procesos;
        for (var i = 1; i <= 3; i++) {
            var cuerpo_procesos = $('.listaproceso' + i + ' tbody');
            //cargar procesos
            if (procesos_general != null && procesos_general != "") {
                cuerpo_procesos.empty();
                var proceso_dato = procesos_general[i];
                for (var pos = 0; pos < proceso_dato.length; pos++) {
                    var valor = proceso_dato[pos];
                    var tr = gestionUsuario.camposprocesos(valor);
                    cuerpo_procesos.append(tr);
                }
            } else {
                cuerpo_procesos.empty();
                var valor = ["", ""];
                var tr = gestionUsuario.camposprocesos(valor);
                cuerpo_procesos.append(tr);
            }
            //remover procesos
            cuerpo_procesos.on('click', '.remove', function () {
                $(this).parent().parent().remove();
            });
        }
        //añadir nuevos procesos
        $('.agregarprocesos').on('click', function (e) {
            e.stopImmediatePropagation();
            var valor = ["", ""];
            var idx = $(this).attr("data-index");
            var tr = gestionUsuario.camposprocesos(valor);
            $(".listaproceso" + idx).append(tr);
        });

    },
    camposprocesos: function (campo) {
        var tr = '<tr>' +
            '<td class="align-middle"><input class="form-control form-control-sm general" value="' + campo[0] + '" /></td>' +
            '<td class="align-middle"><input class="form-control form-control-sm general" value="' + campo[1] + '" /></td>' +
            '<td class="text-center w-1"><a href="#" class="text-danger remove"><i class="fa fa-trash"></i></a>' +
            '</tr>';
        return tr;
    },
    agregar_axiologicas: function (e) {
        e.preventDefault();
        var campos = $('.cuerpo_axiologica > tr');
        var cadena = "";
        campos.each(function (tr_idx, tr) {
            $(tr).children('td').children('.axo-general').each(function (td_idx, td) {
                var val = $(td).val();
                var valor = val.split("|").join("");
                var valor_general = valor.split("•").join("");
                cadena += tr_idx + "•" + td_idx + "•" + valor_general + "|";
            });
        });
        var axiologica = cadena.slice(0, -1);
        var data = {
            'axiologica': axiologica,
            'id_empresa': usuarioModelo.listaUsuario.id_empresa
        }
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_axiologica', data, gestionUsuario.respuestaGeneral);
    },
    agregar_referencia: function (e) {
        var campos = $('.cuerpo_referencia > tr');
        var cadena = "";
        campos.each(function (tr_idx, tr) {
            $(tr).children('td').children('.referencia_general').each(function (td_idx, td) {
                var val = $(td).val();
                var valor = val.split("|").join("");
                cadena += valor + "|";
            });
        });
        var referencia = cadena.slice(0, -1);
        var data = {
            'referencia': referencia,
            'id_empresa': usuarioModelo.listaUsuario.id_empresa
        }
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_referencia', data, gestionUsuario.respuestaGeneral);
    },
    agregar_principios: function (e) {
        var campos = $('.cuerpo_principios > tr');
        var cadena = "";
        campos.each(function (tr_idx, tr) {
            $(tr).children('td').children('.principios_general').each(function (td_idx, td) {
                var val = $(td).val();
                var valor = val.split("|").join("");
                cadena += valor + "|";
            });
        });
        var principio = cadena.slice(0, -1);
        var data = {
            'principio': principio,
            'id_empresa': usuarioModelo.listaUsuario.id_empresa
        }
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_principio', data, gestionUsuario.respuestaGeneral);
    },
    agregar_mision: function (e) {
        e.preventDefault();
        var mision_text = $('#mision_text').val();
        var data = {
            'mision_text': mision_text,
            'id_empresa': usuarioModelo.listaUsuario.id_empresa
        }
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_mision', data, gestionUsuario.respuestaGeneral);
    },
    agregar_vision: function (e) {
        e.preventDefault();
        var vision_text = $('#vision_text').val();
        var data = {
            'vision_text': vision_text,
            'id_empresa': usuarioModelo.listaUsuario.id_empresa
        }
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_vision', data, gestionUsuario.respuestaGeneral);
    },
    agregar_procesos: function (e) {
        var total_tablas = $(".procesogeneral").length;
        var cadena = "";
        var estado = 0;
        for (var datc = 1; datc <= total_tablas; datc++) {
            var campos = $('.listaproceso' + datc + ' tbody > tr');
            var contador = campos.length;
            estado += (contador == 0) ? 1 : 0;
            campos.each(function (tr_idx, tr) {
                $(tr).children('td').children('.general').each(function (td_idx, td) {
                    var val = $(td).val();
                    var valor = val.split("|").join("");
                    var valor_general = valor.split("•").join("");
                    cadena += datc + "•" + tr_idx + "•" + td_idx + "•" + valor_general + "|";
                });
            });
        }
        if (estado >= 1) {
            var mensaje = "No debe dejar tablas/campos vacios.";
            gestionUsuario.respuestaAdvertencia(mensaje);
        } else {
            var general = cadena.slice(0, -1);
            var data = {
                'general': general,
                'id_empresa': usuarioModelo.listaUsuario.id_empresa
            }
            app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_procesos', data, gestionUsuario.respuestaGeneral);
        }
    },
    consultadatosDiagnostico: function (e) {
        var data = {
            'id_empresa': usuarioModelo.listaUsuario.id_empresa
        };
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=consultar_dignostico', data, gestionUsuario.respuestaconsultadatosDiagnostico);
    },
    respuestaconsultadatosDiagnostico: function (respuesta) {
        var datos = respuesta.datos;
        gestionUsuario.datosPCI(datos);
        gestionUsuario.datosPOAM(datos);
        gestionUsuario.datosDofaResumido(datos.dofa);
        gestionUsuario.datosDofaAnalisis(datos.dofa_analisis);
    },
    datosPCI: function (datos) {
        //PCI
        var pci_general = datos.pci;
        for (var datac = 1; datac <= 5; datac++) {
            var tabla_pci = $('.listapci' + datac + " tbody");
            var cuerpo = ("listapci" + datac);
            if (pci_general != null && pci_general != "") {
                tabla_pci.empty();
                var pci_dato = pci_general[datac];
                for (var a = 0; a < pci_dato.length; a++) {
                    var pci = pci_dato[a];
                    var tr = gestionUsuario.campostablaDiagnostico(pci);
                    tabla_pci.append(tr);
                }
            } else {
                tabla_pci.empty();
                var pci = [""];
                var tr = gestionUsuario.campostablaDiagnostico(pci);
                tabla_pci.append(tr);
            }
            //remover bcg
            tabla_pci.on('click', '.remove', function () {
                $(this).parent().parent().remove();
                gestionUsuario.imprimirDiagnostico(cuerpo);
            });
            //calcular PCI
            gestionUsuario.imprimirDiagnostico(cuerpo);
            //Confirmación cerrar
            tabla_pci.find('.general').change(function () {
                usuarioModelo.cambios = 1;
            });
        }
        //añadir PCI
        $('.agregarpci').on('click', function (e) {
            e.stopImmediatePropagation();
            var idx = $(this).attr("data-index");
            var pci = [""];
            var tr = gestionUsuario.campostablaDiagnostico(pci);
            $('.listapci' + idx + ' tbody').append(tr);
            gestionUsuario.imprimirDiagnostico("listapci" + idx);
        });
    },
    datosPOAM: function (datos) {
        //POAM
        var poam_general = datos.poam;
        for (var datac = 1; datac <= 5; datac++) {
            var tabla_poam = $('.listapoam' + datac + " tbody");
            var cuerpo = ("listapoam" + datac);
            if (poam_general != null && poam_general != "") {
                tabla_poam.empty();
                var poam_dato = poam_general[datac];
                for (var a = 0; a < poam_dato.length; a++) {
                    var poam = poam_dato[a];
                    var tr = gestionUsuario.campostablaDiagnostico(poam);
                    tabla_poam.append(tr);
                }
            } else {
                tabla_poam.empty();
                var poam = [""];
                var tr = gestionUsuario.campostablaDiagnostico(poam);
                tabla_poam.append(tr);
            }
            //remover POAM
            tabla_poam.on('click', '.remove', function () {
                $(this).parent().parent().remove();
                gestionUsuario.imprimirDiagnostico(cuerpo);
            });
            //calcular POAM
            gestionUsuario.imprimirDiagnostico(cuerpo);
            //Confirmación cerrar
            tabla_poam.find('.general').change(function () {
                usuarioModelo.cambios = 1;
            });
        }
        //añadir POAM
        $('.agregarpoam').on('click', function (e) {
            e.stopImmediatePropagation();
            var idx = $(this).attr("data-index");
            var poam = [""];
            var tr = gestionUsuario.campostablaDiagnostico(poam);
            $('.listapoam' + idx + ' tbody').append(tr);
            gestionUsuario.imprimirDiagnostico("listapoam" + idx);
        });
    },
    datosDofaResumido: function (dofa) {
        var cerrar = $(".cerrar");
        var tablas = ["pci", "poam"];
        var tipos = ["fortaleza", "debilidad"];
        $('#dofa_text').val(dofa);
        //Datos pci y poam
        for (var a = 0; a < tablas.length; a++) {
            //filas
            var cuerpo = $('.cuerpo_' + tablas[a] + '-total');
            cuerpo.empty();
            for (var pos = 1; pos <= 5; pos++) {
                var tabla = $('.lista' + tablas[a] + pos);
                var titulo = tabla.find('.titulo').text();
                var fortaleza = tabla.find('tfoot .total_fortaleza').text();
                var debilidad = tabla.find('tfoot .total_debilidad').text();
                var tr = '<tr>' +
                    '<td>' + titulo + '</td>' +
                    '<td class="text-center data-fortaleza">' + fortaleza + '</td>' +
                    '<td class="text-center data-debilidad">' + debilidad + '</td>';
                cuerpo.append(tr);
            }
            //columnas
            for (var b = 0; b < tipos.length; b++) {
                var sum_tot = 0;
                cuerpo.find('.data-' + tipos[b]).each(function () {
                    var valor_suma = $(this).text().replace('%', '');
                    if (!isNaN(valor_suma) && valor_suma.length !== 0 && parseInt(valor_suma) != 0) {
                        sum_tot += parseFloat(valor_suma);
                    }
                    var total = parseInt((sum_tot / 5));
                    var general = (!isNaN(total) ? total : 0);
                    cuerpo.parent().find('tfoot .total_' + tipos[b]).html(general + "%");
                });
            }
            var resultado1 = cuerpo.parent().find('tfoot .total_fortaleza').text().replace('%', '');
            var resultado2 = cuerpo.parent().find('tfoot .total_debilidad').text().replace('%', '');
            var resultado_final = ((resultado1 - resultado2) + "%");
            cuerpo.parent().find('tfoot .total_general_' + tablas[a]).text(resultado_final);
        }
        $('#dofa_text').keydown(function () {
            usuarioModelo.cambios = 1;
        });
    },
    datosDofaAnalisis: function (dofa_analisis) {
        var analisis_general = dofa_analisis;
        usuarioModelo.listaDofa = dofa_analisis;
        var arry_for = [];
        var arry_deb = [];
        //Validar si está vacio y traer las calificaciones más relevantes (4, 6 y 9) del PCI y POAM
        if (analisis_general == null || analisis_general == "") {
            $('.diag_general .data_mayor').each(function (index, tr) {
                var mayor_val = $(this).data("val");
                var mayor_tipo = $(this).data("tipo");
                var valor = $(this).find("input.general").val();
                (mayor_tipo == "fortaleza") ? arry_for.push(valor): "";
                (mayor_tipo == "debilidad") ? arry_deb.push(valor): "";

            });
        }
        //Tabla #1
        for (var datac = 1; datac < 4; datac++) {
            var cantidad = (datac >= 2) ? 3 : 2;
            var tabla_analisis = $(".listadofa" + datac + " tbody");
            if (analisis_general != null && analisis_general != "") {
                tabla_analisis.empty();
                var analisis = analisis_general[datac];
                for (var a = 0; a < analisis.length; a++) {
                    var datos_analisis = analisis[a];
                    var cantidad_analisis = datos_analisis.length
                    var tr = gestionUsuario.campostablaDofaAnalisis(datos_analisis, cantidad_analisis);
                    tabla_analisis.append(tr);
                }
            } else {
                tabla_analisis.empty();
                if (datac == 1) {
                    var count = (arry_for.length > arry_deb.length) ? arry_for.length : arry_deb.length;
                    for (var i = 0; i < count; i++) {
                        var dato1 = (arry_for[i] != undefined) ? arry_for[i] : "";
                        var dato2 = (arry_deb[i] != undefined) ? arry_deb[i] : "";
                        var tr = gestionUsuario.campotabla1DofaAnalisis(dato1, dato2);
                        tabla_analisis.append(tr);
                    }
                }
                //Fortalezas
                if (datac == 2) {
                    var count = arry_for.length
                    for (var i = 0; i < count; i++) {
                        var datos = [arry_for[i], "", ""];
                        var tr = gestionUsuario.campostablaDofaAnalisis(datos, cantidad);
                        tabla_analisis.append(tr);
                    }
                }
                //Debilidades
                if (datac == 3) {
                    var count = arry_deb.length
                    for (var i = 0; i < count; i++) {
                        var datos = [arry_deb[i], "", ""];
                        var tr = gestionUsuario.campostablaDofaAnalisis(datos, cantidad);
                        tabla_analisis.append(tr);
                    }
                }
            }
            //remover analisis
            tabla_analisis.on('click', '.remove', function () {
                $(this).parent().parent().remove();
                gestionUsuario.indiceDofaAnalisis();
            });
        }
        gestionUsuario.indiceDofaAnalisis();
        //añadir analisis
        $('.agregardofaanalisis').on('click', function (e) {
            e.stopImmediatePropagation();
            var idx = $(this).attr("data-index");
            var cantidad = $(this).attr("data-cantidad");
            var datos = (cantidad > 2) ? ["", "", ""] : ["", ""];
            var tr = gestionUsuario.campostablaDofaAnalisis(datos, cantidad);
            $('.listadofa' + idx + ' tbody').append(tr);
            gestionUsuario.indiceDofaAnalisis();
        });
        //reportes
        $('.dofa_reporte').click(function (e) {
            e.stopImmediatePropagation();
            var idx = $(this).attr("data-reporte");
            var data = {
                'respuesta': usuarioModelo.listaDofa,
                'razon_social': usuarioModelo.listaUsuario.razon_social
            }
            if (idx == "pdf") {
                app.ajax('../controlador/GestionUsuarioControlador.php?opcion=dofa_pdf', data, gestionUsuario.respuestaGenerarReporte);
                Swal.fire({
                    title: "Generando reporte...",
                    text: "Espera un momento",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                });
            }
            if (idx == "excel") {
                app.ajax('../controlador/GestionUsuarioControlador.php?opcion=dofa_excel', data, gestionUsuario.respuestaGenerarReporte);
                Swal.fire({
                    title: "Generando reporte...",
                    text: "Espera un momento",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                });
            }
        });
    },
    campotabla1DofaAnalisis: function (dato1, dato2) {
        var tr = '<tr>' +
            '<td class="w-1 align-middle"><a href="#" class="text-danger remove"><i class="fa fa-trash"></i></a></td>' +
            '<td class="w-1 data-fila"></td>' +
            '<td>' +
            '<input class="form-control form-control-sm data general" value="' + dato1 + '" /></td>' +
            '<td class="w-1 data-fila"></td>' +
            '<td>' +
            '<input class="form-control form-control-sm data general" value="' + dato2 + '" /></td>' +
            '</tr>';
        return tr;
    },
    campostablaDofaAnalisis: function (datos, cantidad) {
        var tr = '<tr>' +
            '<td class="w-1 align-middle"><a href="#" class="text-danger remove"><i class="fa fa-trash"></i></a></td>' +
            '<td class="w-1 data-fila"></td>' +
            '<td>' +
            '<input class="form-control form-control-sm data general" value="' + datos[0] + '" /></td>' +
            '<td class="w-1 data-fila"></td>' +
            '<td>' +
            '<input class="form-control form-control-sm data general" value="' + datos[1] + '" /></td>';
        if (cantidad > 2) {
            tr += '<td class="w-1 data-fila"></td>' +
                '<td>' +
                '<input class="form-control form-control-sm data general" value="' + datos[2] + '"/></td>';
        }
        tr += "</tr>";
        return tr;
    },
    indiceDofaAnalisis: function (e) {
        for (var datc = 1; datc <= 3; datc++) {
            $('.listadofa' + datc + ' tbody tr').each(function (index, tr) {
                var idx = index + 1;
                $(this).find('td.data-fila').html(idx);
            });
        }
    },
    campostablaDiagnostico: function (campo) {
        var tr = '<tr>';
        tr += '<td class="w-1 align-middle"><a href="#" class="text-danger remove"><i class="fa fa-trash"></i></a></td>';
        tr += '<td class="data-fila text-center"></td>';
        tr += '<td class="align-middle">' +
            '<input class="form-control form-control-sm data general" value="' + campo[0] + '" />' +
            '</td>';
        //Fortalezas
        for (var fortaleza = 1; fortaleza <= 2; fortaleza++) {
            var selected1 = "";
            var selected2 = "";
            var selected3 = "";
            var color = "";
            if (campo[fortaleza] == "1") {
                selected1 = "selected";
                color = "bg-red";
            }
            if (campo[fortaleza] == "2") {
                selected2 = "selected";
                color = "bg-amarillo";
            }
            if (campo[fortaleza] == "3") {
                selected3 = "selected";
                color = "bg-verde";
            }
            tr += '<td class="align-middle ' + color + '">' +
                '<select class="form-control text-center form-control-sm data general fortaleza val-' + fortaleza + ' mb-0" data-pos="' + fortaleza + '" required>' +
                '<option value="0" class="bg-white"></option>' +
                '<option value="1" class="bg-white text-negro" ' + selected1 + '>Bajo</option>' +
                '<option value="2" class="bg-white text-negro" ' + selected2 + '>Medio</option>' +
                '<option value="3" class="bg-white text-negro" ' + selected3 + '>Alto</option>' +
                '</select>' +
                '</td>';
        }
        tr += '<td class="data-fortaleza text-center w-1"></td>';
        //Debilidades
        for (var debilidad = 3; debilidad <= 4; debilidad++) {
            var selected1 = "";
            var selected2 = "";
            var selected3 = "";
            var color = "";
            if (campo[fortaleza] == "1") {
                selected1 = "selected";
                color = "bg-red";
            }
            if (campo[fortaleza] == "2") {
                selected2 = "selected";
                color = "bg-amarillo";
            }
            if (campo[fortaleza] == "3") {
                selected3 = "selected";
                color = "bg-verde";
            }
            tr += '<td class="align-middle ' + color + '">' +
                '<select class="form-control text-center form-control-sm data general debilidad val-' + debilidad + ' mb-0" data-pos="' + debilidad + '">' +
                '<option value="0" class="bg-white"></option>' +
                '<option value="1" class="bg-white text-negro" ' + selected1 + '>Bajo</option>' +
                '<option value="2" class="bg-white text-negro" ' + selected2 + '>Medio</option>' +
                '<option value="3" class="bg-white text-negro" ' + selected3 + '>Alto</option>' +
                '</select>' +
                '</td>';
        }
        tr += '<td class="data-debilidad text-center w-1"></td>';
        tr += '</tr>';
        //devuelve una fila
        return tr;
    },
    imprimirDiagnostico: function (cuerpo) {
        gestionUsuario.calculaDiagnostico(cuerpo);
        $('.' + cuerpo + ' tr td').change(function () {
            gestionUsuario.calculaDiagnostico(cuerpo);
            var valor = $(this).find("option:selected").val();
            if (valor == 0) {
                $(this).removeClass("bg-amarillo").removeClass("bg-verde").removeClass("bg-red");
            }
            if (valor == 1) {
                $(this).removeClass("bg-amarillo").removeClass("bg-verde").addClass("bg-red");
            }
            if (valor == 2) {
                $(this).removeClass("bg-red").removeClass("bg-verde").addClass("bg-amarillo");
            }
            if (valor == 3) {
                $(this).removeClass("bg-amarillo").removeClass("bg-red").addClass("bg-verde");
            }
        });
    },
    calculaDiagnostico: function (cuerpo) {
        var sum_forta = 0;
        var sum_forta_tot = 0;
        var sum_deb = 0;
        var sum_deb_tot = 0;
        var cerrar = $(".cerrar");
        var estado = 0;
        usuarioModelo.Diagnosticos = [];
        var arreglo_diagnostico = [];
        //Calcular fila fortaleza
        $('.' + cuerpo + ' tbody tr').each(function (index, tr) {
            var sum1 = 0;
            var sum2 = 0;
            var sum3 = 0;
            var sum4 = 0;
            var fortaleza = ".fortaleza";
            var debilidad = ".debilidad";
            //Posición fila
            var idx = index + 1;
            $(this).find('td.data-fila').html(idx);
            //Datos
            $(this).find('td').each(function () {
                sum1 += parseFloat($(this).find('.fortaleza.val-1 option:selected').val()) || 0;
                sum2 += parseFloat($(this).find('.fortaleza.val-2 option:selected').val()) || 0;
                sum3 += parseFloat($(this).find('.debilidad.val-3 option:selected').val()) || 0;
                sum4 += parseFloat($(this).find('.debilidad.val-4 option:selected').val()) || 0;
            });
            //Resultados en fila
            var sum_fortaleza = parseInt(sum1 * sum2);
            var sum_debilidad = parseInt(sum3 * sum4);
            $(this).find('td.data-fortaleza').html(sum_fortaleza);
            $(this).find('td.data-debilidad').html(sum_debilidad);
            //Remover clase data_mayor
            $(this).attr("Class", "").attr("data-tipo", "").attr("data-val", "");
            //Validar resultados más relevantes (4, 6 y 9) del PCI y POAM
            if (sum_fortaleza >= 4) {
                $(this).addClass("data_mayor").attr("data-tipo", "fortaleza").attr("data-val", sum_fortaleza);
            }
            if (sum_debilidad >= 4) {
                $(this).addClass("data_mayor").attr("data-tipo", "debilidad").attr("data-val", sum_debilidad);
            }
            //Deshabilitar debilidades si hay fortalezas
            if ($(this).find('td.data-fortaleza').text() != "0") {
                $(this).find(debilidad).attr("disabled", "disabled");
                $(this).find(debilidad).parent().attr('class', '').addClass('align-middle');
                $(this).find(debilidad).val("0");
            } else {
                $(this).find(debilidad).removeAttr("disabled");
            }
            //Deshabilitar fortalezas si hay debilidades
            if ($(this).find('td.data-debilidad').text() != "0") {
                $(this).find(fortaleza).attr("disabled", "disabled");
                $(this).find(fortaleza).parent().attr('class', '').addClass('align-middle');
                $(this).find(fortaleza).val("0");
            } else {
                $(this).find(fortaleza).removeAttr("disabled");
            }
            //Fortaleza total
            $(this).find('.data-fortaleza').each(function () {
                var valor_sumafortaleza = $(this).text();
                if (!isNaN(valor_sumafortaleza) && valor_sumafortaleza.length !== 0 && parseInt(valor_sumafortaleza) != 0) {
                    sum_forta += 1;
                    sum_forta_tot += parseFloat(valor_sumafortaleza);
                }
                var total_fortaleza = parseInt(((sum_forta_tot / sum_forta) / 9) * 100);
                var general = (!isNaN(total_fortaleza) ? total_fortaleza : 0)
                $('.' + cuerpo + ' tfoot tr td.total_fortaleza').html(general + "%");
            })
            //Debilidad total
            $(this).find('.data-debilidad').each(function () {
                var valor_sumadebilidad = $(this).text();
                if (!isNaN(valor_sumadebilidad) && valor_sumadebilidad.length !== 0 && parseInt(valor_sumadebilidad) != 0) {
                    sum_deb += 1;
                    sum_deb_tot += parseFloat(valor_sumadebilidad);
                }
                var total_debilidad = parseInt(((sum_deb_tot / sum_deb) / 9) * 100);
                var general = (!isNaN(total_debilidad) ? total_debilidad : 0)
                $('.' + cuerpo + ' tfoot tr td.total_debilidad').html(general + "%");
            });
            //Revisa si todos los campos están llenos
            $(tr).children('td').children('select:not(:disabled)').each(function (td_idx, td) {
                var val = $(td).val();
                estado += (val == "0") ? 1 : 0;
            });
        });
        if (estado == 0) {
            $(".nav" + cuerpo + "a").removeAttr("disabled");
        } else {
            $(".nav" + cuerpo + "a").attr("disabled", "disabled");
        }
    },
    agregar_diagnostico: function (cuerpo, pos) {
        var cadena = "";
        var estado = 0;
        var alerta = $(".alertadiagnostico");
        $('.lista' + cuerpo + pos + ' tbody > tr').each(function (index, tr) {
            $(tr).children('td').children('select:not(:disabled)').each(function (td_idx, td) {
                var val = $(td).val();
                estado += (val == "0") ? 1 : 0;
            });
        });
        for (var datc = 1; datc <= 5; datc++) {
            var campos = $('.lista' + cuerpo + datc + ' tbody > tr');
            var contador = campos.length;
            estado += (contador == 0) ? 1 : 0;
            campos.each(function (tr_idx, tr) {
                $(tr).children('td').children('.general').each(function (td_idx, td) {
                    var val = $(td).val();
                    var valor = val.split("|").join("");
                    var valor_general = valor.split("•").join("");
                    cadena += datc + "•" + tr_idx + "•" + td_idx + "•" + valor_general + "|";
                });
            });
        }
        if (estado >= 1) {
            var mensaje = "No debe dejar tablas/campos vacios.";
            gestionUsuario.respuestaAdvertencia(mensaje);
        } else {
            var datos = cadena.slice(0, -1);
            var data = {
                'general': datos,
                'id_empresa': usuarioModelo.listaUsuario.id_empresa
            }
            app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_' + cuerpo, data, gestionUsuario.respuestaDiagnostico);
        }
    },
    agregar_Dofaresumido: function (e) {
        e.preventDefault();
        var dofa_text = $('#dofa_text').val();
        var data = {
            'dofa_text': dofa_text,
            'id_empresa': usuarioModelo.listaUsuario.id_empresa
        }
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_dofa', data, gestionUsuario.respuestaDiagnostico);
    },
    agregar_Dofaanalisis: function (e) {
        var cadena = "";
        var estado = 0;
        for (var datc = 1; datc <= 3; datc++) {
            var campos = $('.listadofa' + datc + ' tbody > tr');
            var contador = campos.length;
            estado += (contador == 0) ? 1 : 0;
            campos.each(function (tr_idx, tr) {
                $(tr).children('td').children('.general').each(function (td_idx, td) {
                    var val = $(td).val();
                    var valor = val.split("|").join("");
                    var valor_general = valor.split("•").join("");
                    cadena += datc + "•" + tr_idx + "•" + td_idx + "•" + valor_general + "|";
                });
            });
        }
        if (estado >= 1) {
            var mensaje = "No debe dejar tablas vacias.";
            gestionUsuario.respuestaAdvertencia(mensaje);
        } else {
            var campos = cadena.slice(0, -1);
            var data = {
                'campos': campos,
                'id_empresa': usuarioModelo.listaUsuario.id_empresa
            }
            app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_analisis', data, gestionUsuario.respuestaDiagnostico);
        }
    },
    consultarEstrategias: function (e) {
        var data = {
            'id_empresa': usuarioModelo.listaUsuario.id_empresa
        };
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=consultar_estrategias', data, gestionUsuario.respuestaconsultadatosEstrategias);
    },
    respuestaconsultadatosEstrategias: function (respuesta) {
        var datos = respuesta.datos;
        gestionUsuario.datosSeguimientos(datos);
        gestionUsuario.datosFuerzas(datos);
        gestionUsuario.datosBCG(datos);
        gestionUsuario.datosaxiologica2(datos);
        gestionUsuario.datosreferencia2(datos);
        gestionUsuario.datosprincipios2(datos);
        gestionUsuario.datosEstrategiaPrincipal(datos);
        gestionUsuario.datosFuturo(datos);
        gestionUsuario.datosObjetivos(datos);
        gestionUsuario.datosIndicadores(datos);
        gestionUsuario.coloresGeneral(usuarioModelo.listaUsuario);
    },
    datosSeguimientos: function (datos) {
        var seguimiento_general = datos.seguimientos;
        var tabla_seguimientos = $('.listaseguimientos tbody');
        if (seguimiento_general != null && seguimiento_general != "") {
            tabla_seguimientos.empty();
            for (var a = 0; a < seguimiento_general.length; a++) {
                var seg = seguimiento_general[a];
                var tr = gestionUsuario.campostablaSeguimientos(seg);
                tabla_seguimientos.append(tr);
            }
        } else {
            tabla_seguimientos.empty();
            var seg = ["", "", "", "", "", "", "", "", ""];
            var tr = gestionUsuario.campostablaSeguimientos(seg);
            tabla_seguimientos.append(tr);
        }
        //remover seguimiento
        tabla_seguimientos.on('click', '.remove', function () {
            $(this).parent().parent().remove();
            gestionUsuario.imprimirSeguimientos();
        });
        //Cargar logica de seguimiento
        gestionUsuario.imprimirSeguimientos();
        //añadir seguiomiento
        $('.agregarseguiomiento').on('click', function (e) {
            e.stopImmediatePropagation();
            var idx = $(this).attr("data-index");
            var seg = ["", "", "", "", "", "", "", "", ""];
            var tr = gestionUsuario.campostablaSeguimientos(seg);
            tabla_seguimientos.append(tr);
            gestionUsuario.imprimirSeguimientos();
        });
    },
    campostablaSeguimientos: function (campo) {
        var tr = '<tr>' +
            '<td class="align-middle"><a href="#" class="text-danger remove"><i class="fa fa-trash"></i></a></td>' +
            '<td class="align-middle"><input class="form-control form-control-sm data general" value="' + campo[0] + '" /></td>' +
            '<td class="align-middle"><input type="date" class="form-control form-control-sm data general mb-0 data-seg" value="' + campo[1] + '" /></td>' +
            '<td class="align-middle"><input type="number" class="form-control form-control-sm data general mb-0 dias" min="1" max="90" value="' + campo[2] + '" /></td>' +
            '<td class="align-middle"><input type="date" class="form-control form-control-sm data general mb-0 real" value="' + campo[3] + '" readonly /></td>' +
            '<td class="align-middle"><input type="date" class="form-control form-control-sm data general mb-0" value="' + campo[4] + '"/></td>';
        for (var i = 5; i <= 7; i++) {
            var selected = (campo[i] == "1") ? "selected" : "";
            tr += '<td class="align-middle">' +
                '<select class="form-control text-center form-control-sm data general mb-0">' +
                '<option value="0"></option>' +
                '<option value="1" ' + selected + '>1</option>' +
                '</select>' +
                '</td>';
        }
        tr +=
            '<td class="align-middle"><input type="date" class="form-control form-control-sm data general mb-0" value="' + campo[8] + '" /></td>' +
            '<td class="data-fila text-center align-middle"></td>' +
            '</tr>';
        return tr;
    },
    imprimirSeguimientos: function (e) {
        gestionUsuario.calcularSeguimiento();
        $('.listaseguimientos tbody tr td').change(function () {
            gestionUsuario.calcularSeguimiento();
        });
        //Confirmación cerrar
        $('.listaseguimientos .general').change(function () {
            usuarioModelo.cambios = 1;
        });
    },
    calcularSeguimiento: function (e) {
        var totalrow = $('.listaseguimientos tbody tr').length;
        var sum_tot = 0;
        var general = 0;
        var pie = $('.listaseguimientos tfoot tr td.totalgeneral');
        var color = "#C63430";
        var text_color = "white";
        //Restringir dias hasta 90
        $('.dias').on('mouseup keyup', function () {
            $(this).val(Math.min(90, Math.max(0, $(this).val())));
        });
        //Calcular fila
        $('.listaseguimientos tr:has(td):not(:last)').each(function () {
            var sum = 0;
            var cantfilas = 3;
            $(this).find('td').each(function () {
                sum += parseFloat($(this).find('.data option:selected').val()) || 0;
            });
            var tot = (sum / cantfilas) * 100;
            var totalgeneral = parseInt(tot);
            var colorgeneral = "#C63430";
            var textogeneral = "white"
            if (totalgeneral > 33) {
                colorgeneral = "#FDD300";
                textogeneral = "black";
            }
            if (totalgeneral >= 68) {
                colorgeneral = "#71c904";
                textogeneral = "black";
            }
            $(this).find('td:last').css("background-color", colorgeneral).css("color", textogeneral).html(totalgeneral + "%");
            //Fecha de seguimiento real 
            var dias = parseInt($(this).find('.dias').val()) + 1 || 1; // Número de días a agregar
            var fecha_seg = new Date($(this).find('.data-seg').val());
            fecha_seg.setDate(fecha_seg.getDate() + dias);
            var dia = ("0" + fecha_seg.getDate()).slice(-2);
            var mes = ("0" + (fecha_seg.getMonth() + 1)).slice(-2);
            var real = fecha_seg.getFullYear() + "-" + (mes) + "-" + (dia);
            if (fecha_seg != undefined) {
                $(this).find('.real').val(real);
            }
        });
        //Total
        $('.listaseguimientos tbody tr').each(function (index, tr) {
            $(this).find('.data-fila').each(function () {
                var valor_suma = $(this).text().replace('%', '');
                if (!isNaN(valor_suma) && valor_suma.length !== 0 && parseInt(valor_suma) != 0) {
                    sum_tot += parseFloat(valor_suma);
                }
                var total = parseInt((sum_tot / totalrow));
                general = (!isNaN(total) ? total : 0);
            });
        });
        if (general > 33) {
            color = "#FDD300";
            text_color = "black";
        }
        if (general >= 68) {
            color = "#71c904";
            text_color = "black";;
        }
        pie.css("background-color", color).css("color", text_color).html(general + "%");
    },
    agregar_Seguimiento: function (e) {
        var campos = $('.cuerpo_seguimientos > tr');
        var cadena = "";
        campos.each(function (tr_idx, tr) {
            $(tr).children('td').children('.general').each(function (td_idx, td) {
                var val = $(td).val();
                var valor = val.split("|").join("");
                var valor_general = valor.split("•").join("");
                cadena += tr_idx + "•" + td_idx + "•" + valor_general + "|";
            });
        });
        var datos = cadena.slice(0, -1);
        var data = {
            'campos': datos,
            'id_empresa': usuarioModelo.listaUsuario.id_empresa
        }
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_seguimientos', data, gestionUsuario.respuestaEstrategias);
    },
    datosFuerzas: function (datos) {
        var fuerzas_general = datos.fuerzas;
        var fuerzas_datos = [];
        var fuerzas = ["La Amenaza de entrada de nuevos competidores", "La rivalidad entre los competidores", "El Poder de negociación de los proveedores", "El Poder de negociación de los compradores", "La Amenaza de ingreso de productos sustitutos"];
        if (fuerzas_general != null && fuerzas_general != "") {
            fuerzas_datos = fuerzas_general.split("|");
        }
        //cargar fuerzas
        var i = 1;
        var cuerpo_fuerzas = $('.cuerpo_fuerzas');
        cuerpo_fuerzas.empty();
        for (var pos = 0; pos <= 4; pos++) {
            var valor = (fuerzas_datos.length != 0) ? fuerzas_datos[pos] : "";
            var tr = '<tr>' +
                '<td class="color-empresa align-middle">' + i + '</td>' +
                '<td class="align-middle color-empresa w-50">' + fuerzas[pos] + '</td>' +
                '<td class="align-middle"><input class="form-control form-control-sm general" value="' + valor + '" /></td>' +
                '</tr>';
            cuerpo_fuerzas.append(tr);
            i++;
        }
    },
    agregar_Fuerzas: function (e) {
        var campos = $('.cuerpo_fuerzas > tr');
        var cadena = "";
        campos.each(function (tr_idx, tr) {
            $(tr).children('td').children('.general').each(function (td_idx, td) {
                var val = $(td).val();
                var valor = val.split("|").join("");
                cadena += valor + "|";
            });
        });
        var fuerzas = cadena.slice(0, -1);
        var data = {
            'fuerzas': fuerzas,
            'id_empresa': usuarioModelo.listaUsuario.id_empresa
        }
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_fuerzas', data, gestionUsuario.respuestaEstrategias);
    },
    datosBCG: function (datos) {
        var bcg_general = datos.bcg;
        usuarioModelo.listaBCG = datos.bcg
        var reporte = $(".bcg_reportes");
        for (var datac = 1; datac <= 4; datac++) {
            var tabla_bcg = $('.listabcg' + datac);
            if (bcg_general != null && bcg_general != "") {
                tabla_bcg.empty();
                reporte.removeAttr("disabled");
                var bcg_dato = bcg_general[datac];
                for (var a = 0; a < bcg_dato.length; a++) {
                    var bcg = bcg_dato[a];
                    var tr = gestionUsuario.campostablaBGC(bcg);
                    tabla_bcg.append(tr);
                }
            } else {
                tabla_bcg.empty();
                var bcg = "";
                reporte.attr("disabled", "disabled");
                var tr = gestionUsuario.campostablaBGC(bcg);
                tabla_bcg.append(tr);
            }
            //remover bcg
            tabla_bcg.on('click', '.remove', function () {
                $(this).parent().parent().remove();
            });
            //Confirmación cerrar
            tabla_bcg.find('.general').keyup(function () {
                usuarioModelo.cambios = 1;
            });
        }
        //añadir bcg
        $('.agregarbcg').click(function (e) {
            e.stopImmediatePropagation();
            var idx = $(this).attr("data-index");
            var bcg = "";
            var tr = gestionUsuario.campostablaBGC(bcg);
            $('.listabcg' + idx).append(tr);
        });
        //reportes bcg
        $('.bcg_reporte').click(function (e) {
            e.stopImmediatePropagation();
            var idx = $(this).attr("data-reporte");
            var tipo = {
                "1": "Estrellas",
                "2": "Interrogantes",
                "3": "Vaca lechera",
                "4": "Perro"
            };
            var icono = {
                "1": "star",
                "2": "question-circle",
                "3": "cow",
                "4": "dog"
            };
            var color = {
                "1": "daeef3",
                "2": "c6d9f0",
                "3": "FFFF99",
                "4": "fbd4b4"
            };
            var descr = {
                "1": "1 - Alta participaci\u00f3n en el mercado<br>2 - Mercados creciendo r\u00e1pidamente<br>3 - Se necesita mucho efectivo para financiar el crecimiento<br>4 - Utilidades significativas",
                "2": "1 - Baja participaci\u00f3n en el mercado<br>2 - Mercados creciendo r\u00e1pidamente<br>3 - Se necesita mucho efectivo para financiar el crecimiento<br>4 - Debe evaluar seguir invirtiendo en el negocio",
                "3": "1- Alta participaci\u00f3n en el mercado<br>2- Mercados de crecimiento lento<br>3- Generan m\u00e1s efectivo del que necesitan para su crecimiento<br>4- Pueden usarse para desarrollar otros negocios<br>5- Utilidades significativas",
                "4": "1- Baja participaci\u00f3n en el mercado<br>2- Mercados de crecimiento lento<br>3- Pueden generar pocas utilidades o p\u00e9rdidas<br>4- Deben reestructurarse o eliminarse estos negocios"
            };
            var data = {
                'respuesta': usuarioModelo.listaBCG,
                'tipo': tipo,
                'icono': icono,
                'color': color,
                'descr': descr,
                'razon_social': usuarioModelo.listaUsuario.razon_social
            }
            if (idx == "pdf") {
                app.ajax('../controlador/GestionUsuarioControlador.php?opcion=bcg_pdf', data, gestionUsuario.respuestaGenerarReporte);
                Swal.fire({
                    title: "Generando reporte...",
                    text: "Espera un momento",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                });
            }
            if (idx == "excel") {
                app.ajax('../controlador/GestionUsuarioControlador.php?opcion=bcg_excel', data, gestionUsuario.respuestaGenerarReporte);
                Swal.fire({
                    title: "Generando reporte...",
                    text: "Espera un momento",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                });
            }
        });
    },
    campostablaBGC: function (campo) {
        var tr = '<tr>' +
            '<td class="align-middle w-1"><a href="#" class="text-danger remove"><i class="fa fa-trash"></i></a></td>' +
            '<td class="align-middle"><input class="form-control form-control-sm general" value="' + campo + '" /></td>' +
            '</tr>';
        return tr;
    },
    agregar_BCG: function (e) {
        var total_tablas = $(".bcggeneral").length;
        var cadena = "";
        var estado = 0;
        var alerta = $(".alerta2");
        for (var datc = 1; datc <= total_tablas; datc++) {
            var campos = $('.listabcg' + datc + ' > tr');
            var contador = campos.length;
            estado += (contador == 0) ? 1 : 0;
            campos.each(function (tr_idx, tr) {
                $(tr).children('td').children('.general').each(function (td_idx, td) {
                    var val = $(td).val();
                    var valor = val.split("|").join("");
                    var valor_general = valor.split("•").join("");
                    cadena += datc + "•" + tr_idx + "•" + valor_general + "|";
                });
            });
        }
        if (estado >= 1) {
            var mensaje = "No debe dejar tablas/campos vacios.";
            gestionUsuario.respuestaAdvertencia(mensaje);
        } else {
            var general = cadena.slice(0, -1);
            var data = {
                'general': general,
                'id_empresa': usuarioModelo.listaUsuario.id_empresa
            }
            app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_bcg', data, gestionUsuario.respuestaEstrategias);
        }
    },
    datosaxiologica2: function (datos) {
        var axiologica_general = datos.axiologica;
        var tabla_axiologica = $('.cuerpo_axiologica2');
        //cargar axiologicas
        if (axiologica_general != null && axiologica_general != "") {
            tabla_axiologica.empty();
            for (var a = 0; a < axiologica_general.length; a++) {
                var axiologicas = axiologica_general[a];
                var tr = gestionUsuario.campostablaAxiologica(axiologicas);
                tabla_axiologica.append(tr);
            }
        } else {
            tabla_axiologica.empty();
            var axiologicas = ["", "", "", "", "", "", "", ""]
            var tr = gestionUsuario.campostablaAxiologica(axiologicas);
            tabla_axiologica.append(tr);
        }
        //añadir axiologicas
        $('.addRowaxio2').on('click', function (e) {
            e.stopImmediatePropagation();
            var axiologicas = ["", "", "", "", "", "", "", ""]
            var tr = gestionUsuario.campostablaAxiologica(axiologicas);
            tabla_axiologica.append(tr);
            gestionUsuario.imprimiraxiologica("listableaxio2");
        });
        //restringir caracteres axiologicas
        $('.axo-general').keypress(function (tecla) {
            if ((tecla.charCode == 124 || tecla.charCode == 8226)) return false;
        });
        //calcular axiologicas
        gestionUsuario.imprimiraxiologica("listableaxio2");
        //remover axiologicas
        tabla_axiologica.on('click', '.remove', function () {
            $(this).parent().parent().remove();
            gestionUsuario.imprimiraxiologica("listableaxio2");
        });
    },
    datosreferencia2: function (datos) {
        var referencia_general = datos.referencia;
        var referencia = ["Sociedad", "Estado", "Familia", "Clientes", "Proveedores", "Colaboradores", "Accionistas"];
        var referencia_datos = [];
        if (referencia_general != null && referencia_general != "") {
            referencia_datos = referencia_general.split("|");
        }
        //cargar referencia
        var cuerpo_referencia = $('.cuerpo_referencia2');
        cuerpo_referencia.empty();
        for (var pos = 0; pos < 7; pos++) {
            var valor = (referencia_datos.length != 0) ? referencia_datos[pos] : "";
            var tr = '<tr>' +
                '<td class="align-middle w-25 color-empresa">' + referencia[pos] + '</td>' +
                '<td class="align-middle"><input class="form-control form-control-sm referencia_general" value="' + valor + '" /></td>' +
                '</tr>';
            cuerpo_referencia.append(tr);
        }
    },
    datosprincipios2: function (datos) {
        var principios_general = datos.principio;
        var cuerpo_principios = $('.cuerpo_principios2');
        //cargar principios
        if (principios_general != null && principios_general != "") {
            cuerpo_principios.empty();
            var principios_datos = principios_general.split("|");
            for (var pos = 0; pos < principios_datos.length; pos++) {
                var valor = principios_datos[pos];
                var tr = gestionUsuario.camposprincipios(valor);
                cuerpo_principios.append(tr);
            }
        } else {
            cuerpo_principios.empty();
            var valor = "";
            var tr = gestionUsuario.camposprincipios(valor);
            cuerpo_principios.append(tr);
        }

        //añadir nuevos principios
        $('.agregarprincipios2').on('click', function (e) {
            e.stopImmediatePropagation();
            var valor = "";
            var tr = gestionUsuario.camposprincipios(valor);
            cuerpo_principios.append(tr);
        });

        //remover principios
        cuerpo_principios.on('click', '.remove', function () {
            $(this).parent().parent().remove();
        });
    },
    agregar_axiologicas2: function (e) {
        e.preventDefault();
        var campos = $('.cuerpo_axiologica2 > tr');
        var cadena = "";
        campos.each(function (tr_idx, tr) {
            $(tr).children('td').children('.axo-general').each(function (td_idx, td) {
                var val = $(td).val();
                var valor = val.split("|").join("");
                var valor_general = valor.split("•").join("");
                cadena += tr_idx + "•" + td_idx + "•" + valor_general + "|";
            });
        });
        var axiologica = cadena.slice(0, -1);
        var data = {
            'axiologica': axiologica,
            'id_empresa': usuarioModelo.listaUsuario.id_empresa
        }
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_axiologica2', data, gestionUsuario.respuestaEstrategias);
    },
    agregar_referencia2: function (e) {
        var campos = $('.cuerpo_referencia2 > tr');
        var cadena = "";
        campos.each(function (tr_idx, tr) {
            $(tr).children('td').children('.referencia_general').each(function (td_idx, td) {
                var val = $(td).val();
                var valor = val.split("|").join("");
                cadena += valor + "|";
            });
        });
        var referencia = cadena.slice(0, -1);
        var data = {
            'referencia': referencia,
            'id_empresa': usuarioModelo.listaUsuario.id_empresa
        }
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_referencia2', data, gestionUsuario.respuestaEstrategias);
    },
    agregar_principios2: function (e) {
        var campos = $('.cuerpo_principios2 > tr');
        var cadena = "";
        campos.each(function (tr_idx, tr) {
            $(tr).children('td').children('.principios_general').each(function (td_idx, td) {
                var val = $(td).val();
                var valor = val.split("|").join("");
                cadena += valor + "|";
            });
        });
        var principio = cadena.slice(0, -1);
        var data = {
            'principio': principio,
            'id_empresa': usuarioModelo.listaUsuario.id_empresa
        }
        app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_principio2', data, gestionUsuario.respuestaEstrategias);
    },
    datosEstrategiaPrincipal: function (datos) {
        var estr_general = datos.general;
        for (var datac = 1; datac <= 6; datac++) {
            var tabla_estr = $('.estrategiatabla' + datac).find(".estrategiavacio");
            if (estr_general != null && estr_general != "") {
                tabla_estr.empty();
                var estr_dato = estr_general[datac];
                //campo 0
                var estr0 = estr_dato[0];
                if (estr0 != undefined) {
                    var tabla0 = $('.estrategiatabla' + datac).find("[data-columna='0']");
                    tabla0.empty();
                    for (var a = 0; a < estr0.length; a++) {
                        var valor = estr0[a];
                        var tipo = tabla0.data("tipo");
                        var cmp = gestionUsuario.campostablaEstrategia(valor, tipo);
                        tabla0.append(cmp);
                    }
                }
                //campo 1
                var estr1 = estr_dato[1];
                if (estr1 != undefined) {
                    var tabla1 = $('.estrategiatabla' + datac).find("[data-columna='1']");
                    tabla1.empty();
                    for (var a = 0; a < estr1.length; a++) {
                        var valor = estr1[a];
                        var tipo = tabla1.data("tipo");
                        var cmp = gestionUsuario.campostablaEstrategia(valor, tipo);
                        tabla1.append(cmp);
                    }
                }
                //campo 2
                var estr2 = estr_dato[2];
                if (estr2 != undefined) {
                    var tabla2 = $('.estrategiatabla' + datac).find("[data-columna='2']");
                    tabla2.empty();
                    for (var a = 0; a < estr2.length; a++) {
                        var valor = estr2[a];
                        var tipo = tabla2.data("tipo");
                        var cmp = gestionUsuario.campostablaEstrategia(valor, tipo);
                        tabla2.append(cmp);
                    }
                }
            } else {
                tabla_estr.empty();
                var estr = "";
                var tr = gestionUsuario.campostablaEstrategia(estr, 1);
                tabla_estr.append(tr);
            }
            //remover bcg
            tabla_estr.on('click', '.remove', function () {
                $(this).parent().parent().parent().remove();
            });
            //Confirmación cerrar
            tabla_estr.find('.general').keyup(function () {
                usuarioModelo.cambios = 1;
            });
        }

        $('.agregarestrategias').on('click', function (e) {
            e.stopImmediatePropagation();
            var idx = $(this).attr("data-index");
            var estr = "";
            var cmp = gestionUsuario.campostablaEstrategia(estr, 1);
            $('.estrategiadatos' + idx).append(cmp);
        });
    },
    campostablaEstrategia: function (campo, pos) {
        if (pos > 0) {
            var cmp = '<div class="input-group input-group-sm">' +
                '<input class="rounded-0 form-control general shadow-none" value="' + campo + '" />' +
                '<div class="input-group-append">' +
                '<div class="input-group-text bg-white">' +
                '<a href="#" class="text-danger remove my-auto"><i class="fa fa-trash"></i></a>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        if (pos == 0) {
            var cmp = '<input class="rounded-0 form-control form-control-sm general shadow-none" value="' + campo + '" />';
        }
        return cmp;
    },
    agregar_EstrategiasGeneral: function (e) {
        var total_tablas = $(".estrategiatablas").length;
        var cadena = "";
        var estado = 0;
        var alerta = $(".alerta3");
        for (var datc = 1; datc <= total_tablas; datc++) {
            var campos = $('.estrategiatabla' + datc);
            var contador_vacios = $('.estrategiavacio').length;
            for (var con = 1; con <= contador_vacios; con++) {
                var contador = $('.estrategiadatos' + con + ' > div.input-group').length;
                estado += (contador == 0) ? 1 : 0;
            }
            campos.each(function () {
                $(this).find('.columnas').each(function (a) {
                    var columna = $(this).attr("data-columna");
                    $(this).find('.general').each(function (index, td) {
                        var val = $(td).val();
                        var valor = val.split("|").join("");
                        var valor_general = valor.split("•").join("");
                        cadena += datc + "•" + columna + "•" + index + "•" + valor_general + "|";
                    });
                });
            });
        }
        if (estado >= 1) {
            var mensaje = "No debe dejar campos vacios.";
            gestionUsuario.respuestaAdvertencia(mensaje);
        } else {
            var general = cadena.slice(0, -1);
            var data = {
                'general': general,
                'id_empresa': usuarioModelo.listaUsuario.id_empresa
            }
            app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_general', data, gestionUsuario.respuestaEstrategias);
        }
    },
    datosFuturo: function (datos) {
        //tabla futuro
        var futuro_general = datos.cmi_futuro;
        usuarioModelo.listaFuturo = datos.cmi_futuro
        if (futuro_general != null && futuro_general != "") {
            var tabla = $('.futurotabla0');
            for (var pos = 0; pos <= 2; pos++) {
                var valor = futuro_general[0][pos];
                tabla.find(".general").eq(pos).val(valor);
            }
        }
        //tabla politica y promesa
        for (var pos = 1; pos <= 2; pos++) {
            var tabla = $('.futurotabla' + pos).find(".cuerpo");
            if (futuro_general != null && futuro_general != "") {
                tabla.empty();
                for (var a = 0; a < futuro_general[pos].length; a++) {
                    var valor = futuro_general[pos][a];
                    var tr = gestionUsuario.camposFuturo(valor);
                    tabla.append(tr);
                }
            } else {
                tabla.empty();
                var valor = [""]
                var tr = gestionUsuario.camposFuturo(valor);
                tabla.append(tr);
            }
            tabla.on('click', '.remove', function () {
                $(this).parent().parent().remove();
            });
        }
        $('.agregarfuturo').on('click', function (e) {
            e.stopImmediatePropagation();
            var idx = $(this).attr("data-index");
            var valor = [""];
            var tr = gestionUsuario.camposFuturo(valor);
            $('.futurotabla' + idx + ' tbody').append(tr);
        });
        //reportes
        $('.futuro_reporte').click(function (e) {
            e.stopImmediatePropagation();
            var idx = $(this).attr("data-reporte");
            var data = {
                'respuesta': usuarioModelo.listaFuturo,
                'objetivos': usuarioModelo.listaObjetivos,
                'razon_social': usuarioModelo.listaUsuario.razon_social
            }
            if (idx == "pdf") {
                app.ajax('../controlador/GestionUsuarioControlador.php?opcion=scorecard_pdf', data, gestionUsuario.respuestaGenerarReporte);
                Swal.fire({
                    title: "Generando reporte...",
                    text: "Espera un momento",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                });
            }
            if (idx == "excel") {
                app.ajax('../controlador/GestionUsuarioControlador.php?opcion=scorecard_excel', data, gestionUsuario.respuestaGenerarReporte);
                Swal.fire({
                    title: "Generando reporte...",
                    text: "Espera un momento",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                });
            }
        });
    },
    camposFuturo: function (campo) {
        var tr = '<tr>' +
            '<td class="align-middle"><input class="form-control form-control-sm general" value="' + campo + '" /></td>' +
            '<td class="text-center"><a href="#" class="btn btn-danger btn-sm remove">Remover</a>' +
            '</tr>';
        return tr;
    },
    agregar_Futuro: function (e) {
        var total_tablas = $(".futurogeneral").length;
        var cadena = "";
        var estado = 0;
        var alerta = $(".alerta4");
        for (var pos = 0; pos < total_tablas; pos++) {
            var campos = $('.futurotabla' + pos);
            if (pos != 0) {
                var contador = $('.futurotabla' + pos + ' tbody > tr').length;
                estado += (contador == 0) ? 1 : 0;
            }
            campos.each(function (tr_idx, tr) {
                $(tr).find('.general').each(function (td_idx, td) {
                    var val = $(td).val();
                    var valor = val.split("|").join("");
                    var valor_general = valor.split("•").join("");
                    cadena += pos + "•" + td_idx + "•" + valor_general + "|";
                });
            });
        }
        if (estado >= 1) {
            var mensaje = "No debe dejar campos vacios.";
            gestionUsuario.respuestaAdvertencia(mensaje);
        } else {
            var general = cadena.slice(0, -1);
            var data = {
                'general': general,
                'id_empresa': usuarioModelo.listaUsuario.id_empresa
            }
            app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_cmifuturo', data, gestionUsuario.respuestaEstrategias);
        }
    },
    datosObjetivos: function (datos) {
        var objetivos_general = datos.cmi_objetivos;
        usuarioModelo.listaObjetivos = datos.cmi_objetivos
        var tabla_objetivos = $(".listaobjetivos tbody");
        if (objetivos_general != null && objetivos_general != "") {
            tabla_objetivos.empty();
            for (var a = 0; a < objetivos_general.length; a++) {
                var datos_objetivo = objetivos_general[a];
                var pos = a + 1;
                var tr = gestionUsuario.camposObjetivos(datos_objetivo, pos);
                tabla_objetivos.append(tr);
            }
        } else {
            tabla_objetivos.empty();
            var datos = ["", "", "", ""];
            var tr = gestionUsuario.camposObjetivos(datos, a);
            tabla_objetivos.append(tr);
        }
        //Posición de la fila
        gestionUsuario.imprimirObjetivos(tabla_objetivos);
        //Agregar filas
        $('.agregarobjetivos').on('click', function (e) {
            e.stopImmediatePropagation();
            var valor = ["", "", "", ""];
            var tr = gestionUsuario.camposObjetivos(valor);
            tabla_objetivos.append(tr);
            gestionUsuario.imprimirObjetivos(tabla_objetivos);
        });
        //Remover filas
        tabla_objetivos.on('click', '.remove', function () {
            $(this).parent().parent().remove();
            gestionUsuario.imprimirObjetivos(tabla_objetivos);
        });
    },
    camposObjetivos: function (campo, pos) {
        var tr = '<tr>' +
            '<td class="w-1 align-middle text-center"><a href="#" class="text-danger remove"><i class="fa fa-trash"></i></a></td>' +
            '<td class="w-1">O<span class="data-fila"></span>PH</td>' +
            '<td class="p-0"><textarea class="form-control mb-0 shadow-none rounded-0 data general">' + campo[0] + '</textarea></td>' +
            '<td class="w-1">O<span class="data-fila"></span>PP</td>' +
            '<td class="p-0"><textarea class="form-control mb-0 shadow-none rounded-0 data general">' + campo[1] + '</textarea></td>' +
            '<td class="w-1">O<span class="data-fila"></span>PC</td>' +
            '<td class="p-0"><textarea class="form-control mb-0 shadow-none rounded-0 data general">' + campo[2] + '</textarea></td>' +
            '<td class="w-1">O<span class="data-fila"></span>PF</td>' +
            '<td class="p-0"><textarea class="form-control mb-0 shadow-none rounded-0 data general">' + campo[3] + '</textarea></td>';
        tr += "</tr>";
        return tr;
    },
    imprimirObjetivos: function (cuerpo) {
        cuerpo.calculaObjetivos(cuerpo);
        cuerpo.change(function () {
            gestionUsuario.calculaObjetivos(cuerpo);
        });
    },
    imprimirObjetivos: function (cuerpo) {
        cuerpo.find("tr").each(function (index, tr) {
            var idx = index + 1;
            $(this).find('.data-fila').html(idx);
        });
    },
    agregar_Objetivos: function (e) {
        var cadena = "";
        var campos = $('.listaobjetivos tbody > tr');
        var estado = campos.length;
        campos.each(function (tr_idx, tr) {
            $(tr).children('td').children('.general').each(function (td_idx, td) {
                var val = $(td).val();
                var valor = val.split("|").join("");
                var valor_general = valor.split("•").join("");
                cadena += tr_idx + "•" + td_idx + "•" + valor_general + "|";
            });
        });
        if (estado == 0) {
            var mensaje = "No debe dejar campos vacios.";
            gestionUsuario.respuestaAdvertencia(mensaje);
        } else {
            var campos = cadena.slice(0, -1);
            var data = {
                'general': campos,
                'id_empresa': usuarioModelo.listaUsuario.id_empresa
            }
            app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_objetivos', data, gestionUsuario.respuestaEstrategias);
        }
    },
    datosIndicadores: function (datos) {
        var anio = $('.anio_tabla');
        anio.datepicker({
            minViewMode: 2,
            format: 'yyyy',
        });
        anio.datepicker('setDate', 'now');
        $(".anio_indicador").html(anio.val());
        var indicador_general = datos.cmi;
        usuarioModelo.listaIndicadores = datos.cmi;
        var tabla = $('.indicadorestabla1').find("[data-columna]");
        if (indicador_general != null && indicador_general != "") {
            //Cargar datos
            gestionUsuario.indicadoresLlenos(indicador_general, anio.val());
            //Verifica si existe un arreglo con la fecha establecida
            anio.on("change", function (e) {
                $(".anio_indicador").html($(this).val());
                gestionUsuario.indicadoresLlenos(indicador_general, $(this).val());
            });
        } else {
            gestionUsuario.indicadoresVacios();
        }
        //remover 
        tabla.each(function (a) {
            $(this).on('click', '.remove', function () {
                $(this).parents(".input-group").remove();
            });
        });
        //Calculos x mes
        gestionUsuario.imprimirIndicadores();
        //Agregar indicadores
        $('.agregarindicadores').on('click', function (e) {
            e.stopImmediatePropagation();
            var estr = "";
            var idx = $(this).attr("data-index");
            var tipo = $(this).attr("data-type");
            var valores = $(this).parent().parent().attr("data-valores") || 0;
            var cmp = gestionUsuario.campoMetasAnios(estr, tipo, valores);
            $('.indicadordatos' + idx).append(cmp);
            gestionUsuario.imprimirIndicadores();
        });
        //reportes
        $('.cmi_reporte').click(function (e) {
            e.stopImmediatePropagation();
            var idx = $(this).attr("data-reporte");
            var anio = $('.anio_tabla').val();
            var cadena = "";
            var promedios = "";
            var total = $(".indicadorestabla1 .cmi_total").text().slice(0, -1);
            for (var i = 0; i < 13; i++) {
                var valor = $(".indicadorestabla1 .pos" + i).text().slice(0, -1);
                cadena += valor + "|";
            }
            $('.indicadorestabla1 .groupmes .data-fila').each(function () {
                promedios += $(this).val() + "|";
            });
            cadena += total;
            var totalpromedio = promedios.slice(0, -1);
            var data = {
                'datos_anios': usuarioModelo.listaIndicadores[anio],
                'resultado': cadena,
                'anio': anio,
                'promedio': totalpromedio,
                'razon_social': usuarioModelo.listaUsuario.razon_social
            }
            if (idx == "pdf") {
                app.ajax('../controlador/GestionUsuarioControlador.php?opcion=indicadores_pdf', data, gestionUsuario.respuestaGenerarReporte);
                Swal.fire({
                    title: "Generando reporte...",
                    text: "Espera un momento",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                });
            }
            if (idx == "excel") {
                app.ajax('../controlador/GestionUsuarioControlador.php?opcion=indicadores_excel', data, gestionUsuario.respuestaGenerarReporte);
                Swal.fire({
                    title: "Generando reporte...",
                    text: "Espera un momento",
                    showConfirmButton: false,
                    allowOutsideClick: false,
                });
            }
        });
    },
    indicadoresVacios: function (e) {
        $(".rpt_cmi").attr("disabled", "disabled");
        //Cargar Visión, Misión y Promesa de servicio
        var arry = {};
        var tabla = $('.indicadorestabla1').find("[data-columna]");
        var indx = 2;
        arry[0] = ["Visión", usuarioModelo.listaUsuario.vision];
        arry[1] = ["Misión", usuarioModelo.listaUsuario.mision];
        $('.futurotabla2 .general').each(function (index, tr) {
            var valor = $(this).val();
            arry[indx] = ["Promesa de servicio", valor];
            indx++;
        });
        //Cargar los campos
        tabla.each(function (a) {
            var idx = (a + 1);
            var tipo = $(this).attr("data-tipo") || 1;
            var valores = $(this).parent().attr("data-valores") || 0;
            $(this).empty();
            var campo = "";
            if (a == 0) {
                for (var i = 0; i < indx; i++) {
                    var cmp = gestionUsuario.campoMetasAnios(arry[i], tipo, valores);
                    $(this).append(cmp);
                }
            } else {
                var cmp = gestionUsuario.campoMetasAnios(campo, tipo, valores);
                $(this).append(cmp);
            }
        });
    },
    indicadoresLlenos: function (indicador_general, anio_cambio) {
        $(".rpt_cmi").removeAttr("disabled");
        //Revisar si existe el año en el arreglo
        var estr_dato = indicador_general[anio_cambio];
        if (estr_dato != undefined) {
            var tabla_dato = estr_dato[1];
            var tabla = $('.indicadorestabla1').find("[data-columna]");
            tabla.each(function (a) {
                var idx = (a + 1);
                var estr = tabla_dato[idx];
                var tipo = $(this).attr("data-tipo") || 1;
                var valores = $(this).parent().attr("data-valores") || 0;
                if (estr != undefined) {
                    $(this).empty();
                    for (var j = 0; j < estr.length; j++) {
                        var campo = estr[j];
                        var cmp = gestionUsuario.campoMetasAnios(campo, tipo, valores);
                        $(this).append(cmp);
                    }
                }
            });
            gestionUsuario.imprimirIndicadores();
        } else {
            gestionUsuario.indicadoresVacios();
            gestionUsuario.imprimirIndicadores();
        }
    },
    campoMetasAnios: function (campo, tipo, arreglo) {
        if (tipo == "mul") {
            var dato = arreglo.split(',');
            var cmp = '<div class="input-group input-group-sm">' +
                '<select class="rounded-0 form-control general shadow-none">';
            if (arreglo != undefined) {
                for (var i = 0; i < dato.length; i++) {
                    var sel = (campo == dato[i]) ? "selected" : "";
                    cmp += '<option ' + sel + '>' + dato[i] + '</option>';
                }
            }
            cmp += '</select>' +
                '<div class="input-group-append">' +
                '<div class="input-group-text bg-white">' +
                '<a href="#" class="text-danger remove my-auto"><i class="fa fa-trash"></i></a>' +
                '</div>' +
                '</div>' +
                '</div>';
            return cmp;
        }
        if (tipo == "estra") {
            var val1 = campo[0] || "";
            var val2 = campo[1] || "";
            var cmp = '<div class="input-group row no-gutters">' +
                '<div class="col-6">' +
                '<input class="rounded-0 form-control form-control-sm general shadow-none" value="' + val1 + '" />' +
                '</div>' +
                '<div class="col-6">' +
                '<div class="input-group input-group-sm">' +
                '<input class="rounded-0 form-control general shadow-none" value="' + val2 + '" />' +
                '<div class="input-group-append">' +
                '<div class="input-group-text bg-white">' +
                '<a href="#" class="text-danger remove my-auto"><i class="fa fa-trash"></i></a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            return cmp;
        }
        if (tipo == "metas") {
            var val1 = campo[0] || "";
            var val2 = campo[1] || "";
            var val3 = campo[2] || "";
            var cmp = '<div class="input-group row no-gutters">' +
                '<div class="col-4">' +
                '<input class="rounded-0 form-control form-control-sm general border border-success shadow-none" value="' + val1 + '" />' +
                '</div>' +
                '<div class="col-4">' +
                '<input class="rounded-0 form-control form-control-sm general border border-warning shadow-none" value="' + val2 + '" />' +
                '</div>' +
                '<div class="col-4">' +
                '<div class="input-group input-group-sm">' +
                '<input class="rounded-0 form-control general border border-danger shadow-none" value="' + val3 + '" />' +
                '<div class="input-group-append">' +
                '<div class="input-group-text bg-white">' +
                '<a href="#" class="text-danger remove my-auto"><i class="fa fa-trash"></i></a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            return cmp;
        }
        if (tipo == "anios") {
            var cmp = '<div class="input-group row no-gutters groupmes">';
            for (var i = 0; i < 12; i++) {
                cmp += ' <div class="col p-0">' +
                    '<div class="input-group input-group-sm">' +
                    '<input type="number" class="rounded-0 form-control general meses shadow-none valor" value="' + campo[i] + '" data-valor="' + campo[i] + '" />' +
                    '<div class="input-group-append">' +
                    '<div class="input-group-text rounded-0">' +
                    '<span class="my-auto">%</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            cmp +=
                '<div class="col p-0">' +
                '<div class="input-group input-group-sm">' +
                '<input class="rounded-0 form-control data-fila text-center valor shadow-none bg-white" readonly>' +
                '<div class="input-group-append">' +
                '<div class="input-group-text bg-white">' +
                '<a href="#" class="text-danger remove my-auto"><i class="fa fa-trash"></i></a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            return cmp;
        }
        if (tipo == 1) {
            var cmp = '<div class="input-group input-group-sm">' +
                '<input class="rounded-0 form-control general shadow-none" value="' + campo + '" />' +
                '<div class="input-group-append">' +
                '<div class="input-group-text bg-white">' +
                '<a href="#" class="text-danger remove my-auto"><i class="fa fa-trash"></i></a>' +
                '</div>' +
                '</div>' +
                '</div>';
            return cmp;
        }
    },
    imprimirIndicadores: function (e) {
        var tabla = $('.indicadorestabla1');
        gestionUsuario.calcularIndicadores();
        $('.indicadorestabla1 .general.meses').keyup(function (e) {
            gestionUsuario.calcularIndicadores();
        });
        //Confirmación cerrar
        tabla.find('.general').keyup(function () {
            usuarioModelo.cambios = 1;
        });
        //Alerta calculos
        $('.meses').click(function (e) {
            var input = $(this);
            Swal.fire({
                icon: 'warning',
                title: "Ingrese el calculo",
                html: '<input type="number" id="numero" class="form-control" placeholder="Numerador">' +
                    '<input type="number" id="divisor" class="form-control" placeholder="Denominador">',
                showCancelButton: true,
                cancelButtonText: "Cancelar",
                cancelButtonColor: "#dc3545",
                confirmButtonColor: "#71c904",
                confirmButtonText: "Calcular",
                position: 'top',
            }).then(function (result) {
                if (result.isConfirmed) {
                    var numero = $('#numero').val() || 0;
                    var divisor = $('#divisor').val() || 0;
                    var resultado = (numero / divisor);
                    input.val(resultado.toFixed(2));
                    gestionUsuario.calcularIndicadores();
                }
            })
        });
    },
    calcularIndicadores: function (e) {
        var totalrow = $('.indicadorestabla1 .groupmes').length;
        var sum_tot = 0;
        var general = 0;
        var pie_general = 0;
        var variablelista = {
            "suma0": 0,
            "suma1": 0,
            "suma2": 0,
            "suma3": 0,
            "suma4": 0,
            "suma5": 0,
            "suma6": 0,
            "suma7": 0,
            "suma8": 0,
            "suma9": 0,
            "suma10": 0,
            "suma11": 0,
            "suma12": 0
        };
        //Calcular fila promedio
        $('.indicadorestabla1 .groupmes').each(function () {
            var sum = 0;
            var cantfilas = 12;
            $(this).find('.col').each(function () {
                sum += parseFloat($(this).find('.general').val()) || 0;
            });
            var tot = (sum / cantfilas);
            var total = (tot.toFixed(2));
            $(this).find('.data-fila').val(total + "%");
        });
        //Total
        $('.indicadorestabla1 .groupmes .col').each(function () {
            for (var pos = 0; pos < 13; pos++) {
                if ($(this).index() == pos) {
                    variablelista["suma" + pos] += parseFloat($(this).find('.valor').val()) || 0;
                }
            }
        });
        //calcular logica de las columnas
        for (var pos = 0; pos <= 13; pos++) {
            var pie_tabla = $('.indicadorestabla1 .pie .pos' + pos);
            var totales = (((variablelista["suma" + pos]) / totalrow));
            pie_general += (parseFloat(totales) || 0);
            var totalgeneral = (totales.toFixed(2)) + "%";
            var color = "bg-red";
            if (totales >= 33) {
                color = "bg-amarillo";
            }
            if (totales >= 67) {
                color = "bg-verde";
            }
            pie_tabla.html(totalgeneral);
            pie_tabla.removeClass("bg-red").removeClass("bg-amarillo").removeClass("bg-verde").addClass(color);
        };
        var total_final = (pie_general / 13);
        var pie_final = total_final.toFixed(2);
        var color_final = "bg-red";
        if (total_final >= 33) {
            color_final = "bg-amarillo";
        }
        if (total_final >= 67) {
            color_final = "bg-verde";
        }
        $(".cmi_total").html(pie_final + "%");
        $(".cmi_total").removeClass("bg-red").removeClass("bg-amarillo").removeClass("bg-verde").addClass(color_final);
    },
    agregar_CMI: function (e) {
        var total_tablas = $(".estrategiatablas").length;
        var cadena = "";
        var estado = 0;
        var alerta = $(".alertacmi");
        var anio = $(".anio_tabla").val();
        var datc = 1;
        var campos = $('.indicadorestabla' + datc);
        var contador_vacios = $('.vacio').length;
        for (var con = 1; con <= contador_vacios; con++) {
            var contador = $('.indicadordatos' + con + ' > div.input-group').length;
            estado += (contador == 0) ? 1 : 0;
        }
        campos.each(function () {
            $(this).find('.columnas').each(function (a) {
                var columna = $(this).attr("data-columna");
                $(this).find('.general').each(function (index, td) {
                    var val = $(td).val();
                    var valor = val.split("|").join("");
                    var valor_general = valor.split("•").join("");
                    cadena += anio + "•" + datc + "•" + columna + "•" + index + "•" + valor_general + "|";
                });
            });
            //Columnas especiales con mas de un input en fila
            $(this).find('.columnas2').each(function (a) {
                var columna = $(this).attr("data-columna");
                $(this).find('.row').each(function (idx) {
                    $(this).find('.general').each(function (index, td) {
                        var val = $(td).val();
                        var valor = val.split("|").join("");
                        var valor_general = valor.split("•").join("");
                        cadena += anio + "•" + datc + "•" + columna + "•" + idx + "•" + index + "•" + valor_general + "|";
                    });
                });
            });
        });
        if (estado >= 1) {
            var mensaje = "No debe dejar tablas/campos vacios.";
            gestionUsuario.respuestaAdvertencia(mensaje);
        } else {
            var general = cadena.slice(0, -1);
            var data = {
                'anio': anio,
                'general': general,
                'id_empresa': usuarioModelo.listaUsuario.id_empresa
            }
            app.ajax('../controlador/GestionUsuarioControlador.php?opcion=agregar_cmi', data, gestionUsuario.respuestaEstrategias);
        }
    },
    coloresGeneral: function (datos) {
        var color_empresa = $('.color-empresa');
        var color_link = $('.sidebar .nav-link');
        var color_icono1 = $('.fa-cog');
        var body = $('body');
        var color = datos.color;
        if (datos.color != "" && datos.color != null) {
            //color general de vistas
            color_empresa.removeClass("bg-gradient-primary text-light");
            $(".color-sidebar").remove();
            color_empresa.css("background-color", color);
            var texto_color = gestionUsuario.validarColor(color_empresa.css("background-color")) ? 'white' : 'black';
            color_link.css("color", texto_color);
            color_icono1.css("color", texto_color);
            color_empresa.css("color", texto_color);
            //iconos after
            body.append('<style class="color-sidebar">.sidebar-dark .nav-item .nav-link[data-toggle="collapse"]::after{color: ' + texto_color + ';}</style>');
            body.append('<style class="color-sidebar">.sidebar-dark #sidebarToggle::after{color: ' + texto_color + ';}</style>');
            body.append('<style class="color-sidebar">.sidebar-dark.toggled #sidebarToggle::after{color: ' + texto_color + ';}</style>');
            usuarioModelo.textocolor = texto_color;
        } else {
            color_empresa.addClass("bg-gradient-primary text-light")
        }
    },
    validarColor: function (color) {
        var match = /rgb\((\d+).*?(\d+).*?(\d+)\)/.exec(color);
        return (match[1] & 255) + (match[2] & 255) + (match[3] & 255) < 3 * 256 / 2;
    },
    respuestaGeneral: function (respuesta) {
        if (respuesta.codigo == 1) {
            Swal.fire({
                icon: 'success',
                title: "Perfecto",
                confirmButtonText: 'Confirmar',
                confirmButtonColor: '#71c904',
                text: respuesta.mensaje
            });
            gestionUsuario.consultadatos();
        } else {
            Swal.fire({
                icon: 'error',
                title: "Error",
                confirmButtonText: 'Confirmar',
                confirmButtonColor: "#dc3545",
                text: respuesta.mensaje
            });
        }
    },
    respuestaDiagnostico: function (respuesta) {
        if (respuesta.codigo == 1) {
            gestionUsuario.consultadatosDiagnostico();
            Swal.fire({
                icon: 'success',
                title: "Perfecto",
                confirmButtonText: 'Confirmar',
                confirmButtonColor: '#71c904',
                text: respuesta.mensaje
            });
            usuarioModelo.cambios = 0;
        } else {
            Swal.fire({
                icon: 'error',
                title: "Error",
                confirmButtonText: 'Confirmar',
                confirmButtonColor: "#dc3545",
                text: respuesta.mensaje
            });
        }
    },
    respuestaEstrategias: function (respuesta) {
        if (respuesta.codigo == 1) {
            gestionUsuario.consultarEstrategias();
            gestionUsuario.consultadatos();
            Swal.fire({
                icon: 'success',
                title: "Perfecto",
                confirmButtonText: 'Confirmar',
                confirmButtonColor: '#71c904',
                text: respuesta.mensaje
            });
            usuarioModelo.cambios = 0;
        } else {
            Swal.fire({
                icon: 'error',
                title: "Error",
                confirmButtonText: 'Confirmar',
                confirmButtonColor: "#dc3545",
                text: respuesta.mensaje
            });
        }
    },
    respuestaEmpresaimg: function (respuesta) {
        var respuesta = $.parseJSON(respuesta);
        if (respuesta.codigo == 1) {
            Swal.fire({
                icon: 'success',
                title: "Perfecto",
                confirmButtonText: 'Confirmar',
                confirmButtonColor: '#71c904',
                text: respuesta.mensaje
            });
            gestionUsuario.consultadatos();
        } else {
            Swal.fire({
                icon: 'error',
                title: "Error",
                confirmButtonText: 'Confirmar',
                confirmButtonColor: "#dc3545",
                text: respuesta.mensaje
            });
        }
    },
    respuestaGenerarReporte: function (respuesta) {
        if (respuesta.codigo == 1) {
            var anio = (respuesta.anio != undefined) ? respuesta.anio + "_" : "";
            var a = document.createElement("a");
            a.href = respuesta.reporte;
            a.download = "Reporte_" + respuesta.tipo + "_" + anio + respuesta.nombre + respuesta.ext;
            a.click();
            swal.close()
        } else {
            Swal.fire({
                icon: 'error',
                title: "Error",
                confirmButtonText: 'Confirmar',
                confirmButtonColor: "#dc3545",
                text: respuesta.mensaje
            });
        }
    },
    modalCambiosDiagnostico: function () {
        var btn_cerrar = $(".cerrar");
        var modales = $(".modalvalidacion");
        btn_cerrar.click(function () {
            if (usuarioModelo.cambios != 1) {
                modales.modal('hide');
            } else {
                Swal.fire({
                    title: 'Se han detectado cambios',
                    text: "Si confirmas, no se guardarán tus cambios",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, cerrar!',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        usuarioModelo.cambios = 0;
                        modales.modal('hide');
                    }
                })
            }
        });
    },
    respuestaAdvertencia: function (mensaje) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Toast.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: mensaje
        })
    }
};
gestionUsuario.constructor();
