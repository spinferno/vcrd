function medicalReportReviewBusinessLogic() {
    //cmpp_5963 & 6028
    makingFieldsMandatory();

	// CMPP-5226 - Display to select speciality
    window.$("#vr_audiologist_label").closest(".info").before('<div><label>Please select your speciality below</label></br></br></div>');
	
    // check disabled check option
    $("input[id^='vr_commerciallicencestandard']").each(function () {
        if ($(this).is(":checked")) {
            $(this).removeAttr("disabled");
        }
    });

    // check disabled check option
    $("input[id^='vr_privatelicencestandard']").each(function () {
        if ($(this).is(":checked")) {
            $(this).removeAttr("disabled");
        }
    });

    // Add waiting html
    var loadingHtml = '<div class="modal fade" id="spinner-modal" data-backdrop="static" data-keyboard="false" tabindex="-1">' +
        '<div class="modal-dialog modal-sm">' +
        '<div class="modal-content">' +
        '<div class="modal-body text-center">' +
        '<h3><i class="fa fa-cog fa-spin"></i> Please wait...</h3>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    $("#WebFormControl").append(loadingHtml);

    checkRecordStatus();

    //Hide the out of box buttons and create custom complete button
    $(".workflow-link").hide();
    $("#NextButton").hide();
    $('#NextButton').parent().append('<input type="button" value="Complete" onclick="goComplete();" id="completeBtn" />');

    setTimeout(function () {
        $("#PreviousButton").removeClass("hidden").show();
    }, 100);

    //CMPP-5180 Changes - Show names instead of count of attachment files
    ShowAttachmentFileNames();

    initSectionLinks();    

    $('a.section-link').each(function () {
        var $this = $(this);
        $this.on("click", function () {
            var workflowId = $(this).data('workflowid');
            var targetSelector

            if (workflowId != "#PreviousButton") {
                targetSelector = 'button.workflow-link[data-workflowid="' + $(this).data('workflowid') + '"]';
            } else {
                targetSelector = workflowId;
            };
            $(targetSelector).click();
        });
    });
}

function initSectionLinks() {
    var objSectionSelectors = {
        "Practitioner details": "0bc87c00-4ca4-4029-9804-d26582d5f3c0",
        "Patient details": "6b359002-76a8-471c-98ce-a41b1a9f5715",
        "AssessmentTab": "6b359002-76a8-471c-98ce-a41b1a9f5715", //Vision and eye disorders
        "Blackouts": "6b359002-76a8-471c-98ce-a41b1a9f5715",
        "CardiovascularTab": "6b359002-76a8-471c-98ce-a41b1a9f5715", //Cardiovascular
        "DiabetesTab": "6b359002-76a8-471c-98ce-a41b1a9f5715", //Diabetes
        "HearingTab": "6b359002-76a8-471c-98ce-a41b1a9f5715", //Hearing loss (commercial drivers only)
        "MusculoskeletalDisorderTab": "6b359002-76a8-471c-98ce-a41b1a9f5715", //Musculoskeletal disorders
        "DementiaTab": "6b359002-76a8-471c-98ce-a41b1a9f5715", //Dementia or other cognitive impairment
        "SeizureEpilepsyTab": "6b359002-76a8-471c-98ce-a41b1a9f5715", //Seizures and epilepsy
        "NeurologicalConditionsTab": "6b359002-76a8-471c-98ce-a41b1a9f5715", //Other neurological conditions
        "MentalHealthTab": "6b359002-76a8-471c-98ce-a41b1a9f5715", //Mental health issues
        "SleepDisorderTab": "6b359002-76a8-471c-98ce-a41b1a9f5715", //Sleep disorders
        "DrugsDrivingTab": "6b359002-76a8-471c-98ce-a41b1a9f5715", //Drugs and driving
        "SubstanceMisuseTab": "6b359002-76a8-471c-98ce-a41b1a9f5715", //Substance misuse
        "OtherConditionsTab": "6b359002-76a8-471c-98ce-a41b1a9f5715", //Additional comments
        "tab_MedicalReviewCaseAttachments": "2bbaffac-d876-461e-a7b6-e87859a7f348", // Attachments
        "FTDTab": "#PreviousButton"
      };
    $.each( objSectionSelectors, function( key, value ) {
        switch (key) {
            case 'tab_MedicalReviewCaseAttachments':
            case 'OtherConditionsTab':
            case 'SubstanceMisuseTab':
            case 'DrugsDrivingTab':
            case 'SleepDisorderTab':
            case 'MentalHealthTab':
            case 'NeurologicalConditionsTab':
            case 'SeizureEpilepsyTab':
            case 'DementiaTab':
            case 'MusculoskeletalDisorderTab':
            case 'HearingTab':
            case 'DiabetesTab':
            case 'CardiovascularTab':
            case 'AssessmentTab':
            case 'FTDTab':
                $("div[data-name=\"" + key + "\"]")               
                    .before("<div class=\"section-link-container tab clearfix\"><a class=\"pull-right section-link\"  data-workflowid=\"" + value + "\"><i class=\"fa fa-external-link\" aria-hidden=\"true\"></i> Edit this section</a></div>");
                break;
            default:
                $("fieldset[aria-label=\"" + key + "\"] > legend.section-title:first-of-type")
                    .after("<a class=\"pull-right section-link\"  data-workflowid=\"" + value + "\"><i class=\"fa fa-external-link\" aria-hidden=\"true\"></i> Edit this section</a>");
        };
    });
}

function goComplete() {
    //Show process indicator
    $('#spinner-modal').modal('show');
    // current page will be auto refreshed after the workflow is completed
    $(".workflow-link").click();
}

/**
 * Check if current medical report status is active
 */
function checkRecordStatus() {
    var medicalReportId = $("#EntityFormView_EntityID").val();
    var url = "/getMedicalReport?reportId=" + medicalReportId;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
        beforeSend: function (xhr) {
            request = xhr;
        },
        success: function (medicalreport) {
            if (medicalreport) {
                if (medicalreport["statuscode"] === ReportStatus.Active) {

                    $('#spinner-modal').modal('show');
                    //Retrieve pdf generated flag
                    navigateUserBySummaryNoteStatus();
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("Error: " + errorThrown);
        }
    });
}

/**
 * Check if the pdf summary is generated successfully and navigate user accordingly
 */
function navigateUserBySummaryNoteStatus() {
    var medicalReportId = $("#EntityFormView_EntityID").val();
    var url = "/getMedicalReport?reportId=" + medicalReportId;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
        beforeSend: function (xhr) {
            request = xhr;
        },
        success: function (medicalreport) {
            if (medicalreport) {
                var pdfGeneratedStatus = medicalreport["vr_pdfgeneratedstatus"];
                if (pdfGeneratedStatus === PDFGeneratedStatus.Failed
                    || pdfGeneratedStatus === PDFGeneratedStatus.Success) {
                    $("#NextButton").click();
                } else {
                    //Pdf summary is still generating
                    //wait 1 second and retrieve the status value
                    setTimeout(navigateUserBySummaryNoteStatus(), 1000);
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("Error: " + errorThrown);
        }
    });
}

/* below code will set the fields to mandatory - CMPP 5963 & 6028*/
function makingFieldsMandatory() {
    window.$("#vr_visualacuityrighteyeunaided_label").parent().addClass("required");
    window.$("#vr_patientfirstname_label").parent().addClass('required');
    window.$("#vr_patientlastname_label").parent().addClass('required');
    window.$("#vr_ahpraregistrationnumber_label").parent().addClass('required');
    window.$("#vr_visualacuityrighteyeaided_label").parent().addClass('required');
    window.$("#vr_casenumber_label").parent().addClass("required");
    window.$("#vr_visualacuitylefteyeunaided_label").parent().addClass('required');
    window.$("#vr_visualacuitybinocularunaided_label").parent().addClass('required');
    window.$("#vr_visualacuitylefteyeaided_label").parent().addClass('required');
    window.$("#vr_visualacuitybinocularaided_label").parent().addClass('required');
    window.$("#vr_hasvisionoreyedisorder_label").parent().addClass("required");
    window.$("#vr_requirecorrectivelenseswhiledriving_label").parent().addClass('required');
    window.$("#vr_pleasespecifyreason_label").parent().addClass('required');
    window.$("#vr_hasvisionoreyedisorder_label").parent().addClass('required');
    window.$("#vr_visualacuityrighteyeaided_label").parent().addClass('required');
    window.$("#vr_hasvisualfielddefect_label").parent().addClass("required");
    window.$("#vr_privatestandardsvisionyesnoblank_label").parent().addClass('required');
    window.$("#vr_rationaleforconditions_label").parent().addClass('required');
    window.$("#vr_pleasespecifyreason_label").parent().addClass("required");
    window.$("#vr_pleasespecifyconditionsrecommendation_label").parent().addClass('required');
    window.$("#vr_savetodriveyesnoblank_label").parent().addClass('required');
    window.$("#vr_qualifications_label").parent().addClass('required');
    window.$("#vr_practitionerlastname_label").parent().addClass('required');
    window.$("#vr_practitionerfirstname_label").parent().addClass("required");
    window.$("#vr_visualconditionotherdesc_label").parent().addClass('required');
    window.$("#vr_commercialstandardsvisionyesnoblank_label").parent().addClass('required');
    window.$("#vr_savetodriveprivateyesnoblank_label").parent().addClass('required');
    window.$("#vr_holdaheavyvehiclelicenceendorsement_label").parent().addClass('required');
    window.$("#vr_hasvisionoreyedisorder_label").parent().addClass("required");
    window.$("#vr_dateofbirth_label").parent().addClass('required');
    window.$("#vr_vicroadsreferenceorlicencenumber_label").parent().addClass('required');
    window.$("#vr_practitionerdateofbirth_label").parent().addClass('required');
    window.$("#vr_practicename_label").parent().addClass('required');
    window.$("#vr_isthepatientapplyingforalicence_label").parent().addClass("required");
    window.$("#vr_residentialaddress_label").parent().addClass('required');
    window.$("#vr_assesstohealthinfoyesnoblank_label").parent().addClass('required');
    window.$("#vr_commerciallicencestandardeyesightreport_label").parent().addClass('required');
    window.$("#vr_privatelicencestandardeyesightreport_label").parent().addClass('required');

    //CMPP-6028

    window.$("#vr_blackoutseventdate_label").parent().addClass("required");
    window.$("#vr_blackouts_label").parent().addClass('required');
    window.$("#vr_assesstohealthinfoyesnoblank_label").parent().addClass('required');
    window.$("#vr_areyouageneralpractitionergp_label").parent().addClass('required');
    window.$("#vr_acutemyocardialinfarctioneventdate_label").parent().addClass('required');
    window.$("#vr_conditionstable_label").parent().addClass("required");
    window.$("#vr_commerciallicencestandard_label").parent().addClass('required');
    window.$("#vr_cardiovascularconditionotherdesc_label").parent().addClass('required');
    window.$("#vr_cardiacarrestdate_label").parent().addClass('required');
    window.$("#vr_cabgdate_label").parent().addClass('required');
    window.$("#vr_epilepsymoredetails_label").parent().addClass("required");
    window.$("#vr_diabetesmoredetails_label").parent().addClass('required');
    window.$("#vr_dateofbirth_label").parent().addClass('required');
    window.$("#vr_holdaheavyvehiclelicenceendorsement_label").parent().addClass('required');
    window.$("#vr_hypoglyceamicawareness_label").parent().addClass('required');
    window.$("#vr_isthepatientapplyingforalicence_label").parent().addClass("required");
    window.$("#vr_mentalhealthissuesmoredetails_label").parent().addClass('required');
    window.$("#vr_musculoskeletalconditionotherdesc_label").parent().addClass('required');
    window.$("#vr_othercognitiveimpairmentmoredetails_label").parent().addClass("required");
    window.$("#vr_othercognitiveimpairmenttype_label").parent().addClass('required');
    window.$("#vr_otherneurologicalconditionsmoredetails_label").parent().addClass('required');
    window.$("#vr_pcistentdate_label").parent().addClass('required');
    window.$("#vr_pleasespecify_label").parent().addClass('required');
    window.$("#vr_practicename_label").parent().addClass("required");
    window.$("#vr_practitionerfirstname_label").parent().addClass('required');
    window.$("#vr_practitionerlastname_label").parent().addClass('required');
    window.$("#vr_savetodriveprivateyesnoblank_label").parent().addClass('required');
    window.$("#vr_seizuremostrecenteventdate_label").parent().addClass('required');
    window.$("#vr_sleepdisordersmoredetails_label").parent().addClass("required");
    window.$("#vr_specialistreviewdescription_label").parent().addClass('required');
    window.$("#vr_specialistreviewdescriptionprivate_label").parent().addClass('required');
    window.$("#vr_specifymedications_label").parent().addClass('required');
    window.$("#vr_specifyneuromuscularcondition_label").parent().addClass('required');
    window.$("#vr_specifyotherneurologicalcondition_label").parent().addClass("required");
    window.$("#vr_specifypsychiatriccondition_label").parent().addClass('required');
    window.$("#vr_specifyrestriction_label").parent().addClass('required');
    window.$("#vr_specifysubstancemisusedisorder_label").parent().addClass('required');
    window.$("#vr_strokeintracerebralhaemorrhagemostrecente_label").parent().addClass('required');
    window.$("#vr_subarachnoidhaemorrhagedate_label").parent().addClass('required');
    window.$("#vr_substancemisusemoredetails_label").parent().addClass('required');
    window.$("#vr_syncopeeventdate_label").parent().addClass('required');
    window.$("#vr_transplantdate_label").parent().addClass('required');
    window.$("#vr_treatmentmoredetails_label").parent().addClass("required");
    window.$("#vr_typeofdementia_label").parent().addClass('required');
    window.$("#vr_typeofepilepsy_label").parent().addClass('required');
    window.$("#vr_typeofseizure_label").parent().addClass('required');
    window.$("#vr_vicroadsreferenceorlicencenumber_label").parent().addClass('required');
    window.$("#vr_wellmanagedcardioyesnoblank_label").parent().addClass('required');
    window.$("#vr_wellmanageddiabetesyesnoblank_label").parent().addClass('required');
    window.$("#vr_wellmanagedepilepsyyesnoblank_label").parent().addClass("required");
    window.$("#vr_wellmanagednarcolepsyyesnoblank_label").parent().addClass('required');
    window.$("#vr_wellmanagedneurologicalyesnoblank_label").parent().addClass('required');
    window.$("#vr_wellmanagedpsychiatricyesnoblank_label").parent().addClass('required');
    window.$("#vr_wellmanagedsubstancemisuseyesnoblank_label").parent().addClass('required');
    window.$("#vr_privatelicencestandard_label").parent().addClass('required');
    window.$("#vr_qualifications_label").parent().addClass('required');
    window.$("#vr_radius_label").parent().addClass('required');
    window.$("#vr_residentialaddress_label").parent().addClass('required');
}

// CMPP-5180 Changes - Retrieve name of the attachment files uploaded to a medical report record
// and display it on review page
function ShowAttachmentFileNames() {
    var medicalReportId = $("#EntityFormView_EntityID").val();
    var attachmentNames = "";
    getAttachmentFileNames(medicalReportId,
        (function (result) {
            if (result && result.length > 0) {
                attachmentNames = "<ol class='crmEntityFormView.cell.label'> ";
                var i;
                for (i = 0; i < result.length; i++) {
                    attachmentNames += "<li><a href='/_entity/annotation/" + result[i].annotationid + "' target='_blank'>" + result[i].filename + "</a></li>";
                }
                attachmentNames += "</ol> ";
            }
            else {
                attachmentNames = "<p class='crmEntityFormView.cell.label'>No attachments uploaded</p>";
            }
            $('table[data-name=tabAttachments]').before(attachmentNames);
        }));
}





