function makeValidationsInline()
{
	$("#ValidationSummaryEntityFormView").find('li').each(function (index)
	{
		var id = $(this).find('a').attr('href').replace('_label', '');
		var message = $(this).find('a').html();
		if (!$(id).closest('td').find(".inlineValidation").html())
		{
			$(id).closest('td').append(
				'<div class="validation-summary alert alert-error alert-danger alert-block inlineValidation">' + message + '</div>');
			$(id).closest('td').addClass('alert-error-control');
		}
	});
	$("#ValidationSummaryEntityFormView").hide();
}

function attachInlineValidations()
{
	var mutationObserver = new MutationObserver(function (mutations)
	{
		mutations.forEach(function (mutation)
		{
			if (mutation.addedNodes.length > 0 && mutation.addedNodes.length == 2)
			{
				$(".inlineValidation").remove();
				makeValidationsInline();
			}
		});
	});
	// Starts listening for changes in the root HTML element of the page.
	mutationObserver.observe(document.getElementById("ValidationSummaryEntityFormView"),
	{
		attributes: true,
		characterData: true,
		childList: true,
		subtree: true,
		attributeOldValue: true,
		characterDataOldValue: true
	});
}

function makeValidationsInlineForEntityForm()
{
	$("#ValidationSummaryEntityFormControl_EntityFormView").find('li').each(function (index)
	{
		var id = $(this).find('a').attr('href').replace('_label', '');
		var message = $(this).find('a').html();
		if (!$(id).closest('td').find(".inlineValidation").html())
		{
			$(id).closest('td').append(
				'<div class="validation-summary alert alert-error alert-danger alert-block inlineValidation">' + message + '</div>');
			$(id).closest('td').addClass('alert-error-control');
		}
	});
	$("#ValidationSummaryEntityFormControl_EntityFormView").hide();
}

function attachInlineValidationsForEntityForm()
{
	var mutationObserver = new MutationObserver(function (mutations)
	{
		mutations.forEach(function (mutation)
		{
			if (mutation.addedNodes.length > 0 && mutation.addedNodes.length == 2)
			{
				$(".inlineValidation").remove();
				makeValidationsInlineForEntityForm();
			}
		});
	});
	// Starts listening for changes in the root HTML element of the page.
	mutationObserver.observe(document.getElementById("ValidationSummaryEntityFormControl_EntityFormView"),
	{
		attributes: true,
		characterData: true,
		childList: true,
		subtree: true,
		attributeOldValue: true,
		characterDataOldValue: true
	});
}

function setFieldGroupVisible(fieldNames, visible)
{
	fieldNames.forEach(function (fieldName)
	{
		setFieldVisible(fieldName, visible);
	});
}

function setFieldVisible(fieldName, visible)
{
	var fieldControl = $('#' + fieldName);
	if (visible)
	{
		fieldControl.closest("tr").show();
	}
	else
	{
		fieldControl.closest("tr").hide();
	}
}

function clearFieldValue(fieldName)
{
	var fieldControl = window.$('#' + fieldName);
	var elem = document.getElementById(fieldName);
	var type = elem === null || (elem.type === null || elem.type === undefined) ? "" : elem.type;
	if (elem === null)
	{
		return null;
	}
	//Check what kind of element it is
	var text = (type.indexOf("text") > -1 && elem.className.indexOf("money") === -1 && elem.className.indexOf(
		"datetime") === -1) || type.indexOf("email") > -1;
	var datetime = elem.className.indexOf("datetime") > -1;
	var picklist = elem.className.indexOf("picklist") > -1;
	var checkbox = type.indexOf("checkbox") > -1;
	var radio = elem.className.indexOf("boolean-radio") > -1;
	var lookupAsLookup = document.getElementById(fieldName + '_name') !== null && document.getElementById(fieldName + '_name').className.indexOf('lookup') > -1;
	if (text || picklist)
	{
		fieldControl.val("");
	}
	else if (datetime)
	{
		//This is a date textbox
		fieldControl.next().data("DateTimePicker").clear();
	}
	else if (checkbox)
	{
		//This is a checkbox
		fieldControl.prop("checked", false);
	}
	else if (radio)
	{
		//This is a radiobutton
		window.$("#" + fieldName + "_0").prop("checked", true);
		window.$("#" + fieldName + "_1").prop("checked", false);
	}
	else if (lookupAsLookup)
	{
		$("#" + fieldName + "_entityname").next().children(":first").click();
	}
}

function setFieldGroupRequired(fieldNames, required)
{
	fieldNames.forEach(function (fieldName)
	{
		setFieldRequired(fieldName, required);
	});
}

function clearFieldGroupValue(fieldNames)
{
	fieldNames.forEach(function (fieldName)
	{
		clearFieldValue(fieldName);
	});
}

function sinkFieldGroup(fieldNames)
{
	fieldNames.forEach(function (fieldName)
	{
		sinkField(fieldName);
	});
}

function sinkField(fieldName)
{
	setFieldVisible(fieldName, false);
	setFieldRequired(fieldName, false);
	clearFieldValue(fieldName);
}

function setFieldRequired(fieldName, required)
{
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = $('#' + fieldName + '_label');
	var fieldLabel = fieldLabelControl.text();
	var errorMsg = '<a href="#' + fieldName + '_label"> ' + "This field is required" + '</a>';

	function ev()
	{
		var fieldValue = $('#' + fieldName).val();
		if ((fieldValue == null || $.trim(fieldValue) == ""))
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	if (required)
	{
		removeValidatorById(fieldName + 'RequiredValidator');
		var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", "RequiredValidator", fieldName,
		errorMsg, "", ev);
		fieldLabelControl.parent().addClass("required");
		window.Page_Validators.push(fieldRequiredValidator);
	}
	else
	{
		if (fieldLabelControl.parent().hasClass("required"))
		{
			fieldLabelControl.parent().removeClass("required");
		}
		removeValidatorById(fieldName + 'RequiredValidator');
	}
}

function setFieldRequiredWithCustomMessage(fieldName, required, errorMsg)
{
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = $('#' + fieldName + '_label');
	var fieldLabel = fieldLabelControl.text();
	errorMsg = '<a href="#' + fieldName + '_label"> ' + errorMsg + '</a>';

	function ev()
	{
		var fieldValue = $('#' + fieldName).val();
		if ((fieldValue == null || $.trim(fieldValue) == ""))
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	if (required)
	{
		removeValidatorById(fieldName + 'RequiredValidator');
		var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", "RequiredValidator", fieldName,
		errorMsg, "", ev);
		fieldLabelControl.parent().addClass("required");
		window.Page_Validators.push(fieldRequiredValidator);
	}
	else
	{
		if (fieldLabelControl.parent().hasClass("required"))
		{
			fieldLabelControl.parent().removeClass("required");
		}
		removeValidatorById(fieldName + 'RequiredValidator');
	}
}

function addPastDateValidation(fieldName, errorMessage)
{
	var evaluationfunction = function ()
	{
		var dateValue = window.$('#' + fieldName).val();
		if (dateValue != null)
		{
			dateValue = new Date(dateValue);
		}
		var todayValue = new Date();
		if (dateValue > todayValue)
		{
			return false;
		}
		else
		{
			return true;
		}
	};
	createValidator(fieldName, "pastDateValidation", errorMessage, evaluationfunction);
}

function removeValidatorById(validatorId)
{
	if (window.$('#' + validatorId) != "undefined")
	{
		for (var i = 0; i < window.Page_Validators.length; i++)
		{
			if (window.Page_Validators[i].id == validatorId)
			{
				window.Page_Validators.splice(i, 1);
				i--;
			}
		}
	}
}

function addEmailValidation(fieldName)
{
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = window.$("#" + fieldName + "_label");
	var fieldLabel = fieldLabelControl.text();
	var errMsg = '<a href="#' + fieldName + '_label"> Please enter valid email address</a>';
	var evaluationfunction = function ()
	{
		var fieldValue = window.$('#' + fieldName).val();
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (fieldValue != "" && !regex.test(fieldValue))
		{
			return false;
		}
		else
		{
			return true;
		}
	};
	var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", "EmailValidator", fieldName, errMsg, "",
	evaluationfunction);
	//fieldLabelControl.parent().addClass("required");
	window.Page_Validators.push(fieldRequiredValidator);
}

function addContactNumberOrEmailValidation(contactNumberFieldName, emailFieldName, validatorId)
{
	var evaluationFunction = function ()
	{
		var contactNumber = window.$('#' + contactNumberFieldName).val();
		var emailAddress = window.$('#' + emailFieldName).val();
		var emptyContactNumber = false;
		var emptyEmailAddress = false;
		if ((contactNumber == null || window.$.trim(contactNumber) == ""))
		{
			emptyContactNumber = true;
		}
		if (emailAddress == null || window.$.trim(emailAddress) == "")
		{
			emptyEmailAddress = true;
		}
		if (emptyContactNumber && emptyEmailAddress)
		{
			return false;
		}
		else
		{
			return true;
		}
	};
	createValidator(emailFieldName, validatorId, "Please enter either a valid contact number or email address",
	evaluationFunction);
}

function addAtLeastSelectOneValidation(fieldNames, validatorId, errorMessage)
{
	var evaluationFunction = function ()
	{
		var selected = false;
		fieldNames.forEach(function (fieldName)
		{
			var fieldChecked = window.$('#' + fieldName).is(":checked");
			if (fieldChecked)
			{
				selected = true;
				return selected;
			}
		});
		return selected;
	};
	createValidator(fieldNames[0], validatorId, errorMessage, evaluationFunction);
}

function createValidator(fieldName, validatorId, errorMessage, evaluationfunction)
{
	if (typeof (window.Page_Validators) == "undefined") return;
	var newValidator = document.createElement("span");
	newValidator.style.display = "none";
	newValidator.id = validatorId;
	newValidator.controltovalidate = fieldName;
	newValidator.errormessage = '<a href="#' + fieldName + '_label">' + errorMessage + '</a>';
	newValidator.initialvalue = "";
	newValidator.evaluationfunction = evaluationfunction;
	window.Page_Validators.push(newValidator);
}

function setNotification(fieldName, message)
{
	var html = '<div id="' + fieldName + '_notification" class="alert alert-warning" role="alert">' + message +
		'</div>';
	$("#" + fieldName).closest(".control").after(html);
}

function hideNotification(fieldName)
{
	$('#' + fieldName + '_notification').hide();
}

function showContentMessage(fieldName, message)
{
	var html = '<div><label id="' + fieldName + '_notification">' + message + '</label></div>';
	$("#" + fieldName).closest(".control").after(html);
}

function hideContentMessage(fieldName)
{
	$('#' + fieldName + '_notification').hide();
}

function addExtraSpaceAfterField(fieldName)
{
	var html = '<div><label style="color:white;" id="' + fieldName + '_space">' + -+'</label></div>';
	$("#" + fieldName).closest(".control").after(html);
}

function showHideExtraSpaceAfterField(fieldName, showHide)
{
	if (showHide)
	{
		$('#' + fieldName + '_space').show();
	}
	else
	{
		$('#' + fieldName + '_space').hide();
	}
}

function showNotification(fieldName)
{
	$('#' + fieldName + '_notification').show();
}

function setErrorMessage(fieldName, message)
{
	var html = '<div id="' + fieldName +
		'_errormessage" class="validation-summary alert alert-error alert-danger alert-block inlineValidation" role="error" tabindex="-1">' + message + '</div>';
	$("#" + fieldName).closest(".control").after(html);
}

function addReferenceForSection(sectionName, referenceUrl, referenceText)
{
	var html = '<div>See: <a href="' + referenceUrl + '" target="_blank">' + referenceText + '</a></div>';
	$('table[data-name="' + sectionName + '"]').before(html);
}

function addSubHeading(fieldName, subHeadingText)
{
	var html = '<div id="' + fieldName + '_heading_above"><h4>' + subHeadingText + '</h4></div>';
	$('#' + fieldName).closest("tr").before(html);
}

function removeSubHeadingById(fieldName)
{
	$('#' + fieldName + '_heading_above').remove();
}

function matchCaseNumberAndLicenceNumber(caseNumber, licenceNumber, callback)
{
	var request;
	var url = '/customquery?casenumber=' + caseNumber + '&licencenumber=' + licenceNumber;
	$.ajax(
	{
		type: "GET",
		dataType: "json",
		url: url,
		async: false,
		beforeSend: function (xhr)
		{
			request = xhr;
		},
		success: callback,
		error: function (xmlHttpRequest, textStatus, errorThrown)
		{
			console.log(xmlHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}

function validateCardio()
{
	console.log("Test");
}

function showHideDementia(isVisible)
{
	var fieldGroupHide = ["vr_typeofdementia", "vr_othercognitiveimpairmenttype", "vr_conditionstable",
        "vr_othercognitiveimpairmentmoredetails"
    ];
	setFieldGroupVisible(fieldGroupHide, isVisible);
}

function hideShowValidationContent(reportType)
{
	var rightEye = $("#vr_visualacuityrighteyeunaided").val();
	var leftEye = $("#vr_visualacuitylefteyeunaided").val();
	var aidedSection = $("#vr_visualacuityrighteyeaided").val() == "" && $("#vr_visualacuitylefteyeaided").val() == "" && $("#vr_visualacuitybinocularaided").val() == "";
	var unAidedSection = $("#vr_visualacuityrighteyeunaided").val() == "" && $("#vr_visualacuitylefteyeunaided").val() == "" && $("#vr_visualacuitybinocularunaided").val() == "";
	var heavyVehicle = $("#vr_holdaheavyvehiclelicenceendorsement").val() == YESNODONTKNOW.NO || $("#vr_holdaheavyvehiclelicenceendorsement").val() == YESNODONTKNOW.DONTKNOW;
	var rightEyeAided = $("#vr_visualacuityrighteyeaided").val();
	var leftEyeAided = $("#vr_visualacuitylefteyeaided").val();
	var heavyVehicleEndorsement = $("#vr_heavyvehiclelicenceendorsement").is(":checked");
	var visionValidationUnAidedSingle = "This is not a valid visual acuity score. If you cannot provide a valid score, please select 'I can't complete this section' below";
	var visionValidationUnAidedMultiple = "The patient's unaided visual acuity does not meet the medical standards. Please refer the patient to an optometrist or ophthalmologist";
	var visionValidationAidedSingle = "This is not a valid visual acuity score. If you cannot provide a valid score, please select 'I can't complete this section' below";
	var visionValidationAidedMultiple = "The patient's aided visual acuity does not meet the medical standards. Please refer the patient to an optometrist or ophthalmologist";
	if (reportType == ReportType.EyesightReport)
	{
		visionValidationUnAidedMultiple = "The patient's unaided visual acuity does not meet the national vision standards";
		visionValidationAidedMultiple = "The patient's aided visual acuity does not meet the national vision standards";
	}
	hideNotification("vr_visualacuitylefteyeaided");
	hideNotification("vr_visualacuitylefteyeunaided");
	//Unaided Single
	if (rightEye != "" && leftEye != "" && rightEye == VisualAcuity.Zero && leftEye == VisualAcuity.Zero && aidedSection)
	{
		setNotification("vr_visualacuitylefteyeunaided", visionValidationUnAidedSingle);
		showNotification("vr_visualacuitylefteyeunaided");
	} //56 //Unaided multiple
	else if ((rightEye >= VisualAcuity.BetweenLimit && rightEye <= VisualAcuity.LessThanMax && leftEye >= VisualAcuity.BetweenLimit && leftEye <= VisualAcuity.LessThanMax && heavyVehicle && aidedSection))
	{
		setNotification("vr_visualacuitylefteyeunaided", visionValidationUnAidedMultiple);
		showNotification("vr_visualacuitylefteyeunaided");
	}
	//Aided Single //23
	if (rightEyeAided != "" && leftEyeAided != "" && rightEyeAided == VisualAcuity.Zero && leftEyeAided == VisualAcuity.Zero)
	{
		setNotification("vr_visualacuitylefteyeaided", visionValidationAidedSingle);
		showNotification("vr_visualacuitylefteyeaided");
	}
	//Unaided Multiple
	if ((rightEye >= VisualAcuity.MoreThanLimit && leftEye >= VisualAcuity.MoreThanLimit && aidedSection) || (rightEye >= VisualAcuity.MidValue && leftEye >= VisualAcuity.UpperMid && aidedSection && (!heavyVehicle || heavyVehicleEndorsement)) || (rightEye >= VisualAcuity.UpperMid && leftEye >= VisualAcuity.MidValue && aidedSection && (!heavyVehicle || heavyVehicleEndorsement)))
	{
		setNotification("vr_visualacuitylefteyeunaided", visionValidationUnAidedMultiple);
		showNotification("vr_visualacuitylefteyeunaided");
	}
	//Aided Multiple
	if ((rightEyeAided >= VisualAcuity.MoreThanLimit && leftEyeAided >= VisualAcuity.MoreThanLimit))
	{
		setNotification("vr_visualacuitylefteyeaided", visionValidationAidedMultiple);
		showNotification("vr_visualacuitylefteyeaided");
	}
	//60
	else if ((rightEyeAided >= VisualAcuity.MidValue && leftEyeAided >= VisualAcuity.UpperMid) && (!heavyVehicle || heavyVehicleEndorsement))
	{
		setNotification("vr_visualacuitylefteyeaided", visionValidationAidedMultiple);
		showNotification("vr_visualacuitylefteyeaided");
	}
	//61
	else if ((rightEyeAided >= VisualAcuity.UpperMid && leftEyeAided >= VisualAcuity.MidValue) && (!heavyVehicle || heavyVehicleEndorsement))
	{
		setNotification("vr_visualacuitylefteyeaided", visionValidationAidedMultiple);
		showNotification("vr_visualacuitylefteyeaided");
	}
	//57
	else if ((rightEyeAided >= VisualAcuity.BetweenLimit && rightEyeAided <= VisualAcuity.LessThanMax && leftEyeAided >= VisualAcuity.BetweenLimit && leftEyeAided <= VisualAcuity.LessThanMax) && heavyVehicle)
	{
		setNotification("vr_visualacuitylefteyeaided", visionValidationAidedMultiple);
		showNotification("vr_visualacuitylefteyeaided");
	}
}

function showMentalHealth(isVisible)
{
	var fieldGroup = ["vr_specifypsychiatriccondition", "vr_wellmanagedpsychiatricyesnoblank"];
	setFieldGroupVisible(fieldGroup, isVisible);
	if (!isVisible)
	{
		setFieldVisible("vr_mentalhealthissuesmoredetails", NO);
		setFieldRequired("vr_wellmanagedpsychiatricyesnoblank", false);
		setFieldRequired("vr_specifypsychiatriccondition", false);
		setFieldRequired("vr_mentalhealthissuesmoredetails", false);
	}
	else
	{
		setFieldRequiredWithCustomMessage("vr_wellmanagedpsychiatricyesnoblank", true, "Please select an option");
		setFieldRequired("vr_specifypsychiatriccondition", true);
	}
}

function showSubstanceMisuse(isVisible, isClear)
{
	if (isVisible)
	{
		var fieldGroup = ["vr_specifysubstancemisusedisorder", "vr_wellmanagedsubstancemisuseyesnoblank"];
		setFieldGroupVisible(fieldGroup, isVisible);
		setFieldRequired("vr_specifysubstancemisusedisorder", false);
		setFieldRequired("vr_specifysubstancemisusedisorder", true);
		setFieldRequired("vr_wellmanagedsubstancemisuseyesnoblank", false);
		setFieldRequiredWithCustomMessage("vr_wellmanagedsubstancemisuseyesnoblank", true, "Please select an option");
	}
	else
	{
		var fieldGroupHide = ["vr_specifysubstancemisusedisorder", "vr_wellmanagedsubstancemisuseyesnoblank",
            "vr_substancemisusemoredetails"
        ];
		setFieldGroupVisible(fieldGroupHide, isVisible);
		setFieldRequired("vr_specifysubstancemisusedisorder", false);
		setFieldRequired("vr_wellmanagedsubstancemisuseyesnoblank", false);
		setFieldRequired("vr_substancemisusemoredetails", false);
		if (isClear)
		{
			clearFieldValue("vr_substancemisusemoredetails");
			clearFieldValue("vr_specifysubstancemisusedisorder");
			clearFieldValue("vr_wellmanagedsubstancemisuseyesnoblank");
		}
	}
}

function showHideSeizureWellmanaged()
{
	if ($("#vr_hadseizure_1").is(":checked") || $("#vr_hasepilepsy_1").is(":checked"))
	{
		setFieldVisible("vr_wellmanagedepilepsyyesnoblank", true);
		setFieldRequiredWithCustomMessage("vr_wellmanagedepilepsyyesnoblank", true, "Please select an option");
	}
	else
	{
		setFieldVisible("vr_wellmanagedepilepsyyesnoblank", false);
		setFieldRequired("vr_wellmanagedepilepsyyesnoblank", false);
		setFieldVisible("vr_epilepsymoredetails", false);
		setFieldRequired("vr_epilepsymoredetails", false);
		clearFieldValue("vr_epilepsymoredetails");
		$("#vr_wellmanagedepilepsyyesnoblank").val("");
	}
}

function showSeizure(isVisible, isClear)
{
	if (isVisible)
	{
		var fieldGroup = ["vr_typeofseizure", "vr_seizuremostrecenteventdate", "vr_idontknowtheexactseizuredate",
            "vr_seizurepreviouseventdate", "vr_idontknowthepreviousseizureexactdate", "vr_medicationceaseddate",
            "vr_idontknowtheexactmedicationceaseddate", "vr_wellmanagedepilepsyyesnoblank"
        ];
		setFieldGroupVisible(fieldGroup, isVisible);
		setFieldRequired("vr_typeofseizure", true);
		if (!window.$("#vr_idontknowtheexactseizuredate").is(":checked"))
		{
			setFieldRequired("vr_seizuremostrecenteventdate", true);
		}
		else
		{
			setFieldVisible("vr_seizuremostrecenteventdate", false);
		}
		window.$("[data-name=SeizureDetailsSection]").closest("fieldset").show();
	}
	else
	{
		var fieldGroupHide = ["vr_typeofseizure", "vr_seizuremostrecenteventdate", "vr_idontknowtheexactseizuredate",
            "vr_seizuredatemonth", "vr_seizuredateyear", "vr_seizurepreviouseventdate",
            "vr_idontknowthepreviousseizureexactdate", "vr_previousseizuredatemonth", "vr_previousseizuredateyear",
            "vr_medicationceaseddate", "vr_idontknowtheexactmedicationceaseddate", "vr_medicationceaseddateyear",
            "vr_wellmanagedepilepsyyesnoblank", "vr_epilepsymoredetails", "vr_medicationceaseddatemonth"
        ];
		setFieldRequired("vr_typeofseizure", false);
		setFieldRequired("vr_seizuremostrecenteventdate", false);
		setFieldGroupVisible(fieldGroupHide, isVisible);
		window.$("[data-name=SeizureDetailsSection]").closest("fieldset").hide();
		if (isClear)
		{
			clearFieldGroupValue(fieldGroupHide);
		}
	}
}

function showNeuro(isVisible, isClear)
{
	if (isVisible)
	{
		var fieldGroup = ["vr_neurodevelopmentaldisorders", "vr_aneurysmsintracranial", "vr_cerebralpalsy",
            "vr_headbraininjury", "vr_menieresdisease", "vr_multiplesclerosis", "vr_neuromuscularcondition",
            "vr_parkinsonsdisease", "vr_spaceoccupyinglesions", "vr_strokeintracerebralhaemorrhage",
            "vr_strokeintracerebralhaemorrhage", "vr_subarachnoidhaemorrhage", "vr_otherneurologicalcondition",
            "vr_wellmanagedneurologicalyesnoblank"
        ];
		setFieldGroupVisible(fieldGroup, isVisible);
		setFieldRequiredWithCustomMessage("vr_wellmanagedneurologicalyesnoblank", true, "Please select an option");
		addAtLeastSelectOneValidation(fieldGroup, "applyingAtLeastSelectOneValidationNeuro",
			"Please make a selection below");
	}
	else
	{
		var fieldGroupHide = ["vr_aneurysmsintracranial", "vr_cerebralpalsy", "vr_headbraininjury",
            "vr_menieresdisease", "vr_multiplesclerosis", "vr_neuromuscularcondition", "vr_parkinsonsdisease",
            "vr_spaceoccupyinglesions", "vr_strokeintracerebralhaemorrhage", "vr_strokeintracerebralhaemorrhage",
            "vr_strokeintracerebralhaemorrhagemostrecente", "vr_idontknowstrokeintracerebralhaemorrhageda",
            "vr_strokeintracerebralhaemorrhagedatemonth", "vr_strokeintracerebralhaemorrhagedateyear",
            "vr_subarachnoidhaemorrhage", "vr_subarachnoidhaemorrhagedate",
            "vr_idontknowsubarachnoidhaemorrhagedate", "vr_subarachnoidhaemorrhagedatemonth",
            "vr_subarachnoidhaemorrhagedateyear", "vr_otherneurologicalcondition",
            "vr_wellmanagedneurologicalyesnoblank", "vr_otherneurologicalconditionsmoredetails",
            "vr_specifyotherneurologicalcondition", "vr_specifyneuromuscularcondition"
        ];
		setFieldRequired("vr_wellmanagedneurologicalyesnoblank", false);
		setFieldRequired("vr_otherneurologicalconditionsmoredetails", false);
		setFieldRequired("vr_specifyneuromuscularcondition", false);
		setFieldRequired("vr_strokeintracerebralhaemorrhagemostrecente", false);
		setFieldRequired("vr_subarachnoidhaemorrhagedate", false);
		setFieldRequired("vr_specifyotherneurologicalcondition", false);
		setFieldGroupVisible(fieldGroupHide, isVisible);
		if (isClear)
		{
			clearFieldGroupValue(fieldGroupHide);
		}
		removeValidatorById("applyingAtLeastSelectOneValidationNeuro");
	}
}

function hideSleepDisorder()
{
	var fieldGroupHide = ["vr_wellmanagednarcolepsyyesnoblank", "vr_sleepdisordersmoredetails"];
	setFieldGroupVisible(fieldGroupHide, false);
}

function showHideSleepDisorder()
{
	if (window.$("#vr_sleepapnoea_1").is(':checked') || window.$("#vr_narcolepsy_1").is(':checked'))
	{
		setFieldVisible("vr_wellmanagednarcolepsyyesnoblank", YES);
		setFieldRequiredWithCustomMessage("vr_wellmanagednarcolepsyyesnoblank", YES, "Please select an option");
		// CMPP-5255 Show "Please provide more details" field
		setFieldRequired("vr_sleepdisordersmoredetails", true);
		setFieldVisible("vr_sleepdisordersmoredetails", true);
	}
	else
	{
		setFieldVisible("vr_wellmanagednarcolepsyyesnoblank", NO);
		setFieldRequired("vr_wellmanagednarcolepsyyesnoblank", NO);
		setFieldVisible("vr_sleepdisordersmoredetails", NO);
		setFieldRequired("vr_sleepdisordersmoredetails", NO);
		clearFieldValue("vr_wellmanagednarcolepsyyesnoblank");
		clearFieldValue("vr_sleepdisordersmoredetails");
	}
}

function setTabheadersandCheckboxes()
{
	var url = "/getTabHeaders/";
	window.$.ajax(
	{
		type: "GET",
		dataType: "json",
		url: url,
		beforeSend: function (xhr)
		{
			request = xhr;
		},
		success: function (tabHeaders)
		{
			console.log(tabHeaders);
			window.$("[data-name=VisionTab]").prepend('<a target="_blank" href="https://austroads.com.au/publications/assessing-fitness-to-drive/ap-g56/vision-and-eye-disorders">' + tabHeaders.VisionTab + '</a>');
			window.$("[data-name=DiabetesTab]").prepend('<a target="_blank" href="https://austroads.com.au/publications/assessing-fitness-to-drive/ap-g56/diabetes-mellitus">' + tabHeaders.DiabetesTab + '</a>');
			window.$("[data-name=HearingTab]").prepend('<a target="_blank" href="https://austroads.com.au/publications/assessing-fitness-to-drive/ap-g56/hearing-loss-and-deafness">' + tabHeaders.HearingTab + '</a>');
			window.$("[data-name=MusculoskeletalDisorderTab]").prepend('<a target="_blank" href="https://austroads.com.au/publications/assessing-fitness-to-drive/ap-g56/musculoskeletal-conditions">' + tabHeaders.MusculoskeletalDisorderTab +
				'</a>');
			window.$("[data-name=DementiaTab]").prepend('<a target="_blank" href="https://austroads.com.au/publications/assessing-fitness-to-drive/ap-g56/neurological-conditions/dementia">' + tabHeaders.DementiaTab + '</a>');
			window.$("[data-name=DrugsDrivingTab]").prepend('<a target="_blank" href="https://austroads.com.au/publications/assessing-fitness-to-drive/ap-g56/substance-misuse-including-alcoh7_yq8gyf">' + tabHeaders.DrugsDrivingTab +
				'</a>');
			window.$("[data-name=MentalHealthTab]").prepend('<a target="_blank" href="https://austroads.com.au/publications/assessing-fitness-to-drive/ap-g56/psychiatric-conditions">' + tabHeaders.MentalHealthTab +
				'</a>');
			window.$("[data-name=SleepDisorderTab]").prepend('<a target="_blank" href="https://austroads.com.au/publications/assessing-fitness-to-drive/ap-g56/sleep-disorders">' + tabHeaders.SleepDisorderTab +
				'</a>');
			window.$("[data-name=SeizureEpilepsyTab]").prepend('<a target="_blank" href="https://austroads.com.au/publications/assessing-fitness-to-drive/ap-g56/neurological-conditions/seizures-and-epilepsy">' + tabHeaders.SeizureEpilepsyTab +
				'</a>');
			window.$("[data-name=BlackoutsTab]").prepend('<a target="_blank" href="https://austroads.com.au/publications/assessing-fitness-to-drive/ap-g56/blackouts">' + tabHeaders.BlackoutsTab + '</a>');
			window.$("[data-name=SubstanceMisuseTab]").prepend('<a target="_blank" href="https://austroads.com.au/publications/assessing-fitness-to-drive/ap-g56/substance-misuse-including-alcoh7_yq8gyf">' + tabHeaders.SubstanceMisuseTab +
				'</a>');
			window.$("[data-name=NeurologicalConditionsTab]").prepend('<a target="_blank" href="https://austroads.com.au/publications/assessing-fitness-to-drive/ap-g56/neurological-conditions">' + tabHeaders.NeurologicalConditionsTab +
				'</a>');
			window.$("[data-name=CardiovascularTab]").prepend('<a target="_blank" href="https://austroads.com.au/publications/assessing-fitness-to-drive/ap-g56/cardiovascular-conditions" target="_blank">' + tabHeaders.CardiovascularTab +
				'</a>');
		},
		error: function (xmlHttpRequest, textStatus, errorThrown)
		{
			console.log(xmlHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
	//window.$("#vr_havediabetesrequiringdietandexercise").attr('title', "Please select the relevant treatment(s) below");
	window.$("#vr_hasmusculoskeletaldisorder").attr('title', "Please select the relevant condition(s) below");
	window.$("#vr_isassessmentcompleted").closest('tr').hide();
	if (!window.$("#vr_isassessmentcompleted_1").is(":checked"))
	{
		window.$('input[type=radio]:not([id^="vr_isassessmentcompleted"])').removeAttr('checked');
	}
}

function showHideDiabetiesMoreDetails()
{
	if ($("#vr_wellmanageddiabetesyesnoblank").val() == YESNODONTKNOW.NO || $("#vr_hypoglyceamicawareness").val() == YESNODONTKNOW.NO)
	{
		setFieldVisible("vr_diabetesmoredetails", YES);
		setFieldRequired("vr_diabetesmoredetails", YES);
	}
	else
	{
		setFieldVisible("vr_diabetesmoredetails", NO);
		setFieldRequired("vr_diabetesmoredetails", NO);
		var fieldGroup = ["vr_diabetesmoredetails"];
		clearFieldGroupValue(fieldGroup);
	}
}

function makehypoglycaemicMandatory()
{
	if (window.$("#vr_havediabetesrequiringdietandexercise_1").is(":checked") || window.$("#vr_havediabetesrequiringmedication_1").is(
		":checked"))
	{
		setFieldVisible("vr_hypoglyceamicawareness", YES);
		setFieldRequiredWithCustomMessage("vr_hypoglyceamicawareness", YES, "Please select an option");
		window.$('#vr_hypoglyceamicawareness').on('blur', function (event)
		{
			return setFieldRequiredWithCustomMessage("vr_hypoglyceamicawareness", YES, "Please select an option");
		});
		setFieldVisible("vr_wellmanageddiabetesyesnoblank", YES);
		setFieldRequiredWithCustomMessage("vr_wellmanageddiabetesyesnoblank", YES, "Please select an option");
		window.$('#vr_wellmanageddiabetesyesnoblank').on('blur', function (event)
		{
			return setFieldRequiredWithCustomMessage("vr_wellmanageddiabetesyesnoblank", YES, "Please select an option");
		});
	}
	else
	{
		setFieldVisible("vr_hypoglyceamicawareness", NO);
		setFieldRequired("vr_hypoglyceamicawareness", NO);
		setFieldVisible("vr_wellmanageddiabetesyesnoblank", NO);
		setFieldRequired("vr_wellmanageddiabetesyesnoblank", NO);
		setFieldVisible("vr_diabetesmoredetails", NO);
		setFieldRequired("vr_diabetesmoredetails", NO);
		var fieldGroup = ["vr_hypoglyceamicawareness", "vr_wellmanageddiabetesyesnoblank", "vr_diabetesmoredetails",
            "vr_diabetesmoredetails"
        ];
		clearFieldGroupValue(fieldGroup);
	}
}

function showHideDiabetiesFields()
{
	if ((window.$("#vr_heavyvehiclelicenceendorsement").is(":checked") || window.$(
		"#vr_holdaheavyvehiclelicenceendorsement").val() == YESNODONTKNOW.YES) && (window.$(
		"#vr_insulin").is(":checked") || window.$("#vr_otherglucoseloweringagents").is(":checked")))
	{
		showNotification("vr_otherglucoseloweringagents");
	}
	else
	{
		hideNotification("vr_otherglucoseloweringagents");
	}
}

function showMuskoSkeletal(isVisible, isClear)
{
	if (isVisible)
	{
		var fieldGroupShow = ["vr_hasmusculoskeletaldisorder_0", "vr_lossoflimborlimbfunction", "vr_physicalfrailty",
            "vr_musculoskeletalconditionother"
        ];
		addAtLeastSelectOneValidation(fieldGroupShow, "applyingAtLeastSelectOneValidationMusko",
			"Please make a selection below");
		setFieldGroupVisible(fieldGroupShow, isVisible);
	}
	else
	{
		var fieldGroup = ["vr_lossoflimborlimbfunction", "vr_physicalfrailty", "vr_musculoskeletalconditionother",
            "vr_musculoskeletalconditionotherdesc"
        ];
		setFieldGroupVisible(fieldGroup, isVisible);
		if (isClear)
		{
			clearFieldGroupValue(fieldGroup);
		}
		setFieldRequired("vr_musculoskeletalconditionotherdesc", false);
		removeValidatorById("applyingAtLeastSelectOneValidationMusko");
	}
}

function HideDiabeties()
{
	var fieldGroupHide = ["vr_insulin", "vr_otherglucoseloweringagents", "vr_hypoglyceamicawareness",
        "vr_wellmanageddiabetesyesnoblank", "vr_diabetesmoredetails"
    ];
	setFieldGroupVisible(fieldGroupHide, false);
}

function showHideBlackouts(isVisible)
{
	var fieldGroupHide;
	if (isVisible)
	{
		showNotification("vr_blackouts");
		fieldGroupHide = ["vr_blackoutseventdate", "vr_idontknowtheblackoutdate", "vr_previousblackouteventdate",
            "vr_idontknowthepreviousblackoutdate"
        ];
		setFieldGroupVisible(fieldGroupHide, isVisible);
		if (!window.$("#vr_idontknowtheblackoutdate").is(":checked"))
		{
			setFieldRequired("vr_blackoutseventdate", true);
		}
		else
		{
			setFieldVisible("vr_blackoutseventdate", false);
		}
	}
	else
	{
		hideNotification("vr_blackouts");
		fieldGroupHide = ["vr_blackoutseventdate", "vr_idontknowtheblackoutdate", "vr_blackouteventdatemonth",
            "vr_blackouteventdateyear", "vr_previousblackouteventdate", "vr_idontknowthepreviousblackoutdate",
            "vr_previousblackouteventdatemonth", "vr_previousblackouteventdateyear"
        ];
		setFieldGroupVisible(fieldGroupHide, isVisible);
		setFieldRequired("vr_blackoutseventdate", false);
	}
}

function hideCardioVascularFieldsOnload()
{
	var fieldGroupHide = ["vr_acutemyocardialinfarctioneventdate", "vr_cardiacarrestdate", "vr_syncopeeventdate",
        "vr_pcistentdate", "vr_pcistentdate", "vr_cabgdate", "vr_transplantdate",
        "vr_idontknowacutemyocardialinfarctiondate", "vr_acutemyocardialinfarctioneventdatemonth",
        "vr_acutemyocardialinfarctioneventdateyear", "vr_aneurysmsize", "vr_idontknowthecardiacarrestdate",
        "vr_cardiacarresteventdateyear", "vr_idontknowtheexactsyncopedate", "vr_syncopeeventdatemonth",
        "vr_syncopeeventdatemonth", "vr_syncopeeventdateyear", "vr_cardiovascularconditionotherdesc",
        "vr_pcistentdatemonth", "vr_pcistentdateyear", "vr_treatmentmoredetails", "vr_cabgdatemonth",
        "vr_cabgdateyear", "vr_hearttransplantdatemonth", "vr_hearttransplantdateyear",
        "vr_cardiacarresteventdatemonth", "vr_idontknowtheexactpcistentdate", "vr_idontknowtheexactcabgdate",
        "vr_idontknowtheexacthearttransplantdate"
    ];
	setFieldGroupVisible(fieldGroupHide, false);
	//Set Date pickers
	setUpBirthDateControlMinDate("vr_acutemyocardialinfarctioneventdate");
	setUpBirthDateControlMinDate("vr_cardiacarrestdate");
	setUpBirthDateControlMinDate("vr_syncopeeventdate");
	setUpBirthDateControlMinDate("vr_pcistentdate");
	setUpBirthDateControlMinDate("vr_cabgdate");
	setUpBirthDateControlMinDate("vr_transplantdate");
	setUpBirthDateControlMinDate("vr_blackoutseventdate");
	setUpBirthDateControlMinDate("vr_previousblackouteventdate");
	//neuro
	setUpBirthDateControlMinDate("vr_subarachnoidhaemorrhagedate");
	setUpBirthDateControlMinDate("vr_strokeintracerebralhaemorrhagemostrecente");
	//seizure
	setUpBirthDateControlMinDate("vr_seizuremostrecenteventdate");
	setUpBirthDateControlMinDate("vr_seizurepreviouseventdate");
	setUpBirthDateControlMinDate("vr_medicationceaseddate");
	addCombinationValidation("vr_acutemyocardialinfarctioneventdate", "vr_idontknowacutemyocardialinfarctiondate",
		"vr_acutemyocardialinfarction");
	addCombinationValidation("vr_cardiacarrestdate", "vr_idontknowthecardiacarrestdate", "vr_cardiacarrest");
	addCombinationValidation("vr_syncopeeventdate", "vr_idontknowtheexactsyncopedate", "vr_syncope");
	addCombinationValidation("vr_pcistentdate", "vr_idontknowtheexactpcistentdate", "vr_pcistent");
	addCombinationValidation("vr_cabgdate", "vr_idontknowtheexactcabgdate", "vr_coronaryarterybypassgrafting");
	addCombinationValidation("vr_transplantdate", "vr_idontknowtheexacthearttransplantdate", "vr_hearttransplant");
	addCombinationValidation("vr_subarachnoidhaemorrhagedate", "vr_idontknowsubarachnoidhaemorrhagedate",
		"vr_subarachnoidhaemorrhage");
	addCombinationValidation("vr_strokeintracerebralhaemorrhagemostrecente",
		"vr_idontknowstrokeintracerebralhaemorrhageda", "vr_strokeintracerebralhaemorrhage");
	addRangeAndNumericValidator("vr_aneurysmsize", "vr_aneurysmsabdominalthoracic");
}

function setUpBirthDateControlMinDate(id)
{
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth();
	date = today.getDate();
	var maxDate = new Date();
	var minDate = new Date("01/01/1920");
	window.$('#' + id).next().data("DateTimePicker").minDate(minDate);
	window.$('#' + id).next().data("DateTimePicker").maxDate(maxDate);
	window.$('#' + id).next().data("DateTimePicker").locale("en-au");
}

function clearCardioFields()
{
	//Remove selection
	var fieldGroup = ["vr_acutemyocardialinfarction", "vr_idontknowacutemyocardialinfarctiondate",
        "vr_aneurysmsabdominalthoracic", "vr_angina", "vr_atrialfibrillation", "vr_cardiacarrest",
        "vr_dilatedcardiomyopathy", "vr_hcmcardiomyopathy", "vr_congenitaldisorders", "vr_ecgchanges",
        "vr_heartfailure", "vr_hypertension", "vr_paroxysmalarrhythmiaseg",
        "vr_syncope", "vr_idontknowtheexactsyncopedate", "vr_valvularheartdisease",
        "vr_cardiovascularconditionother", "vr_implantablecardiacdefibrillator", "vr_pacemaker", "vr_pcistent",
        "vr_idontknowtheexactpcistentdate", "vr_vad", "vr_anticoagulanttherapy", "vr_coronaryarterybypassgrafting",
        "vr_idontknowtheexactcabgdate", "vr_hearttransplant", "vr_idontknowtheexacthearttransplantdate",
        "vr_acutemyocardialinfarctioneventdate", "vr_acutemyocardialinfarctioneventdatemonth",
        "vr_acutemyocardialinfarctioneventdateyear", "vr_aneurysmsize", "vr_cardiacarrestdate",
        "vr_cardiacarresteventdatemonth", "vr_cardiacarresteventdateyear", "vr_syncopeeventdate",
        "vr_syncopeeventdatemonth", "vr_syncopeeventdateyear", "vr_cardiovascularconditionotherdesc",
        "vr_pcistentdate", "vr_pcistentdatemonth", "vr_pcistentdateyear", "vr_cabgdate", "vr_cabgdatemonth",
        "vr_cabgdateyear", "vr_transplantdate", "vr_hearttransplantdatemonth", "vr_hearttransplantdateyear",
        "vr_wellmanagedcardioyesnoblank", "vr_idontknowthecardiacarrestdate",
        "vr_idontknowacutemyocardialinfarctiondate", "vr_idontknowtheexactsyncopedate",
        "vr_idontknowtheexactcabgdate", "vr_idontknowtheexacthearttransplantdate",
        "vr_idontknowtheexactpcistentdate"
    ];
	clearFieldGroupValue(fieldGroup);
	setFieldRequired("vr_cardiovascularconditionotherdesc", false);
}

function showHideCardioVascularSections(isVisible)
{
	if (!isVisible)
	{
		window.$("[data-name=CardiovascularConditionSection1]").closest("fieldset").hide();
		window.$("[data-name=CardiovascularConditionSection2]").closest("fieldset").hide();
		window.$("[data-name=CardiovascularConditionSection3]").closest("fieldset").hide();
		window.$("[data-name=CardiovascularTreatmentSection2]").closest("fieldset").hide();
		window.$("[data-name=CardiovascularTreatmentSection1]").closest("fieldset").hide();
		removeValidatorById("applyingAtLeastSelectOneValidationCardio");
		var fieldGroupHide = ["vr_acutemyocardialinfarctioneventdate", "vr_cardiacarrestdate", "vr_syncopeeventdate",
            "vr_pcistentdate", "vr_pcistentdate", "vr_cabgdate", "vr_transplantdate",
            "vr_idontknowacutemyocardialinfarctiondate", "vr_acutemyocardialinfarctioneventdatemonth",
            "vr_acutemyocardialinfarctioneventdateyear", "vr_aneurysmsize", "vr_idontknowthecardiacarrestdate",
            "vr_cardiacarresteventdateyear", "vr_idontknowtheexactsyncopedate", "vr_syncopeeventdatemonth",
            "vr_syncopeeventdatemonth", "vr_syncopeeventdateyear", "vr_cardiovascularconditionotherdesc",
            "vr_pcistentdatemonth", "vr_pcistentdateyear", "vr_treatmentmoredetails", "vr_cabgdatemonth",
            "vr_cabgdateyear", "vr_hearttransplantdatemonth", "vr_hearttransplantdateyear",
            "vr_cardiacarresteventdatemonth", "vr_idontknowtheexactpcistentdate", "vr_idontknowtheexactcabgdate",
            "vr_idontknowtheexacthearttransplantdate"
        ];
		setFieldGroupVisible(fieldGroupHide, false);
	}
	else
	{
		window.$("[data-name=CardiovascularConditionSection1]").closest("fieldset").show();
		window.$("[data-name=CardiovascularConditionSection2]").closest("fieldset").show();
		window.$("[data-name=CardiovascularConditionSection3]").closest("fieldset").show();
		window.$("[data-name=CardiovascularTreatmentSection2]").closest("fieldset").show();
		window.$("[data-name=CardiovascularTreatmentSection1]").closest("fieldset").show();
		var fieldGroup = ["vr_hascardiovascularcondition", "vr_acutemyocardialinfarction",
            "vr_aneurysmsabdominalthoracic", "vr_angina", "vr_aneurysmsabdominalthoracic", "vr_atrialfibrillation",
            "vr_cardiacarrest", "vr_dilatedcardiomyopathy", "vr_hcmcardiomyopathy",
            "vr_cardiomyopathytypenotindicated", "vr_congenitaldisorders", "vr_congenitaldisorders",
            "vr_ecgchanges", "vr_heartfailure", "vr_paroxysmalarrhythmiaseg", "vr_paroxysmalarrhythmiaseg",
            "vr_syncope", "vr_valvularheartdisease", "vr_cardiovascularconditionother",
            "vr_implantablecardiacdefibrillator", "vr_pacemaker", "vr_pcistent", "vr_vad",
            "vr_aneurysmsabdominalthoracic", "vr_wellmanagedcardioyesnoblank", "vr_hypertension",
            "vr_coronaryarterybypassgrafting", "vr_hearttransplant", "vr_anticoagulanttherapy"
        ];
		addAtLeastSelectOneValidation(fieldGroup, "applyingAtLeastSelectOneValidationCardio",
			"Please make a selection below");
	}
}

function showHideVisionOrderBased(isVisible, clearValue)
{
	var isChecked = isVisible;
	var checkedNo = false;
	var isAssesmentCompleted = $("#vr_isassessmentcompleted_1").is(":checked");
	if (isAssesmentCompleted)
	{
		isChecked = $("#vr_hasvisionoreyedisorder_1").is(":checked");
	}
	checkedNo = $("#vr_hasvisionoreyedisorder_0").is(":checked");
	if (!isChecked && !checkedNo)
	{ // not checked
		var fieldGroupHide = ["vr_cataracts", "vr_cataractslefteye", "vr_diabeticretinopathy", "vr_diplopiadoublevision", "vr_glaucoma", "vr_maculardegeneration",
            "vr_monocularvisionlossofvisioninoneeye", "vr_nystagmus", "vr_opticneuropathy", "vr_poornightvision",
            "vr_retinitispigmentosa", "vr_visualconditionother", "vr_visualconditionotherdesc",
            "vr_hasvisualfielddefect", "vr_privatestandardsvisionyesnoblank",
            "vr_commercialstandardsvisionyesnoblank"
        ];
		if (clearValue)
		{
			clearFieldGroupValue(fieldGroupHide);
		}
		hideNotification("vr_hasvisionoreyedisorder");
		removeValidatorById("applyingAtLeastSelectOneValidationVision");
		setFieldGroupVisible(fieldGroupHide, false);
		removeValidatorById("vr_hasvisualfielddefectRequiredValidator");
		setFieldRequired("vr_visualconditionotherdesc", false);
		setFieldRequired("vr_privatestandardsvisionyesnoblank", false);
		setFieldRequired("vr_commercialstandardsvisionyesnoblank", false);
	}
	else if (checkedNo)
	{
		var fieldGroupHide = ["vr_cataracts", "vr_cataractslefteye", "vr_diabeticretinopathy", "vr_diplopiadoublevision", "vr_glaucoma", "vr_maculardegeneration",
            "vr_monocularvisionlossofvisioninoneeye", "vr_nystagmus", "vr_opticneuropathy", "vr_poornightvision",
            "vr_retinitispigmentosa", "vr_visualconditionother", "vr_visualconditionotherdesc",
            "vr_hasvisualfielddefect", "vr_privatestandardsvisionyesnoblank",
            "vr_commercialstandardsvisionyesnoblank"
        ];
		if (clearValue)
		{
			clearFieldGroupValue(fieldGroupHide);
		}
		hideNotification("vr_hasvisionoreyedisorder");
		removeValidatorById("applyingAtLeastSelectOneValidationVision");
		setFieldGroupVisible(fieldGroupHide, false);
		removeValidatorById("vr_hasvisualfielddefectRequiredValidator");
		setFieldRequired("vr_visualconditionotherdesc", false);
		setFieldRequired("vr_privatestandardsvisionyesnoblank", false);
		setFieldRequired("vr_commercialstandardsvisionyesnoblank", false);
	}
	else
	{
		var fieldGroupshow = ["vr_cataracts", "vr_cataractslefteye", "vr_diabeticretinopathy",
            "vr_diplopiadoublevision", "vr_glaucoma", "vr_maculardegeneration",
            "vr_monocularvisionlossofvisioninoneeye", "vr_nystagmus", "vr_opticneuropathy", "vr_poornightvision",
            "vr_retinitispigmentosa", "vr_visualconditionother", "vr_hasvisualfielddefect"
        ];
		setFieldGroupVisible(fieldGroupshow, true);
		showNotification("vr_hasvisionoreyedisorder");
		var fieldGroup = ["vr_hasvisionoreyedisorder", "vr_cataracts", "vr_cataractslefteye",
            "vr_diabeticretinopathy", "vr_diplopiadoublevision", "vr_glaucoma",
            "vr_maculardegeneration", "vr_monocularvisionlossofvisioninoneeye", "vr_nystagmus",
            "vr_opticneuropathy", "vr_poornightvision", "vr_retinitispigmentosa", "vr_visualconditionother",
            "vr_hasvisualfielddefect"
        ];
		addAtLeastSelectOneValidation(fieldGroup, "applyingAtLeastSelectOneValidationVision",
			"Please make a selection below");
		requiredRadioButton("vr_hasvisualfielddefect");
	}
}
//Recomendation Sections

function recomendationOnload()
{
	var fieldGroupHide = ["vr_onroaddrivingassessmentprivate", "vr_savetodriveprivateyesnoblank",
        "vr_specialistreviewprivate", "vr_specialistreviewdescriptionprivate", "vr_periodicmedicalreview",
        "vr_correctivelenses", "vr_modifiedvehiclerestriction", "vr_daylighthoursrestriction",
        "vr_radiusrestriction", "vr_specifyrestriction", "vr_radius", "vr_rationaleforconditions",
        "vr_savetodriveyesnoblank", "vr_periodicmedicalreviewcommercial", "vr_specialistreviewdescription",
        "vr_correctivelensestobewornwhiledriving", "vr_dateofreport", "vr_onroaddrivingassessment", "vr_specialistreview"
    ];
	setFieldGroupVisible(fieldGroupHide, false);
}
//Details

function changeICantCompleteThisSection()
{
	var visualAcuityFieldGroup = ["vr_visualacuityrighteyeunaided", "vr_visualacuitylefteyeunaided",
        "vr_visualacuitybinocularunaided",
        "vr_visualacuityrighteyeaided", "vr_visualacuitylefteyeaided", "vr_visualacuitybinocularaided",
        "vr_visualacuityunaidedrighteyeadditionalinfo", "vr_visualacuityunaidedlefteyeadditionalinfo",
        "vr_visualacuityunaidedbinocularadditional", "vr_visualacuityaidedrighteyeadditionalinfo",
        "vr_visualacuityaidedlefteyeadditionalinfo", "vr_visualacuityaidedbinocularadditionalinfo",
        "vr_additionalcomments"
    ];
	var isClientClick = false;
	if (this.checked)
	{
		window.$("[data-name=VisualAcuityAidedSection]").closest("fieldset").hide();
		window.$("[data-name=VisualAcuityUnaidedSection]").closest("fieldset").hide();
		showHideExtraSpaceAfterField("vr_icantcompletethissection", false);
		sinkFieldGroup(visualAcuityFieldGroup);
		setFieldVisible("vr_additionalcomments", NO);
		setFieldVisible("vr_pleasespecifyreason", YES);
		setFieldRequired("vr_pleasespecifyreason", YES);
		removeSubHeadingById("vr_visualacuityrighteyeunaided");
		removeSubHeadingById("vr_visualacuityrighteyeaided");
		removeValidatorById("vr_hasvisualfielddefectRequiredValidator");
	}
	else
	{
		window.$("[data-name=VisualAcuityAidedSection]").closest("fieldset").show();
		window.$("[data-name=VisualAcuityUnaidedSection]").closest("fieldset").show();
		showHideExtraSpaceAfterField("vr_icantcompletethissection", true);
		setFieldGroupVisible(visualAcuityFieldGroup, YES);
		setFieldRequired("vr_pleasespecifyreason", NO);
		setFieldVisible("vr_additionalcomments", YES);
		sinkField("vr_pleasespecifyreason");
		requiredRadioButton("vr_hasvisualfielddefect");
	}
}

function addRangeAndNumericValidator(fieldName, RequiredcheckBox)
{
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = $('#' + fieldName + '_label');
	var fieldLabel = fieldLabelControl.text();
	var errorMsg = '<a href="#' + fieldName + '_label">Please enter a number between 0 and 150.</a>';

	function ef()
	{
		var fieldValue = window.$('#' + fieldName).val();
		var isChecked = window.$('#' + RequiredcheckBox).is(":checked");
		if (isChecked && !(window.$.isNumeric(fieldValue) && fieldValue >= Validation.MinRange && fieldValue <= Validation.MaxRange))
		{
			return false;
		}
		else
		{
			return true;
		}
		var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", "RangeValidator", fieldName, errorMsg,
			"", ef);
		window.Page_Validators.push(fieldRequiredValidator);
	}
}

function addRangeValidator(fieldName)
{
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = $('#' + fieldName + '_label');
	var fieldLabel = fieldLabelControl.text();
	var ev = function ()
	{
		var fieldValue = window.$("#" + fieldName).val();
		if (window.$("#vr_icantcompletethissection").is(":checked"))
		{
			return true;
		}
		if (!(window.$.isNumeric(fieldValue) && fieldValue >= Validation.MinRange && fieldValue <= Validation.MaxRange))
		{
			window.$('#' + fieldName).parent().find('#' + fieldName + '_inlineRequiredValidator').show();
			return false;
		}
		else
		{
			return true;
		}
	};
	var errMsg = '<a href="#' + fieldName + '_label">Please enter a number between 0 and 150.</a>';
	var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", "RangeValidator", fieldName, errMsg, "",
	ev);
	fieldLabelControl.parent().addClass("required");
	window.Page_Validators.push(fieldRequiredValidator);
}

function addRangeValidatorForCardio(fieldName)
{
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = $("#" + fieldName + "_label");
	var fieldLabel = fieldLabelControl.text();
	var errMsg = '<a href="#' + fieldName + '_label">Please enter a number between 0 and 150.</a>';
	var evaluationfunction = function ()
	{
		var fieldValue = window.$('#' + fieldName).val().trim();
		if (((window.$.isNumeric(fieldValue) && fieldValue >= Validation.MinRange && fieldValue <= Validation.MaxRange) || fieldValue === ""))
		{
			return true;
		}
		else
		{
			return false;
		}
	};
	var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", "RangeValidator", fieldName, errMsg, "",
	evaluationfunction);
	window.Page_Validators.push(fieldRequiredValidator);
}
//new

function requiredRadioButton(fieldName)
{
	if (typeof (window.Page_Validators) == 'undefined') return;
	var fieldLabelControl = window.$("#" + fieldName + "_label");
	var fieldLabel = fieldLabelControl.text();
	var fieldRequiredValidator = document.createElement('span');
	fieldRequiredValidator.style.display = "none";
	fieldRequiredValidator.id = fieldName + "RequiredValidator";
	fieldRequiredValidator.controltovalidate = fieldName;
	fieldRequiredValidator.errormessage = "<a href='" + "#" + fieldName + "_label" + "'> Please select an option</a>";
	fieldRequiredValidator.initialvalue = "";
	fieldRequiredValidator.evaluationfunction = function ()
	{
		var checkBoxNo = window.$("#" + fieldName + "_0").is(":checked");
		var checkBoxYes = window.$("#" + fieldName + "_1").is(":checked");
		if (checkBoxNo || checkBoxYes)
		{
			return true;
		}
		else
		{
			return false;
		}
	};
	fieldLabelControl.parent().addClass("required");
	window.Page_Validators.push(fieldRequiredValidator);
}

function requiredRadioButtonForRecomendation(fieldName)
{
	if (typeof (window.Page_Validators) == 'undefined') return;
	var fieldLabelControl = window.$("#" + fieldName + "_label");
	var fieldLabel = fieldLabelControl.text();
	var fieldRequiredValidator = document.createElement('span');
	fieldRequiredValidator.style.display = "none";
	fieldRequiredValidator.id = fieldName + "RequiredValidator";
	fieldRequiredValidator.controltovalidate = fieldName;
	fieldRequiredValidator.errormessage = "<a href='" + "#" + fieldName + "_label" + "'> Please select an option</a>";
	fieldRequiredValidator.initialvalue = "";
	fieldRequiredValidator.evaluationfunction = function ()
	{
		var op1 = window.$("#" + fieldName + "_0").is(":checked");
		var op2 = window.$("#" + fieldName + "_1").is(":checked");
		var op3 = window.$("#" + fieldName + "_2").is(":checked");
		var op4 = window.$("#" + fieldName + "_3").is(":checked");
		if (op1 || op2 || op3 || op4)
		{
			return true;
		}
		else
		{
			return false;
		}
	};
	fieldLabelControl.parent().addClass("required");
	window.Page_Validators.push(fieldRequiredValidator);
}

function addRangeValidatorForAided(fieldName)
{
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = $('#' + fieldName + '_label');
	var fieldLabel = fieldLabelControl.text();
	var errMsg = '<a href="#' + fieldName + '_label">Please enter a number between 0 and 150</a>';
	var evaluationfunction = function ()
	{
		var fieldValue = window.$("#" + fieldName).val();
		if (window.$("#vr_icantcompletethissection").is(":checked"))
		{
			return true;
		}
		if (window.$("#vr_requirecorrectivelenseswhiledriving_1").is(":checked") && !(window.$.isNumeric(fieldValue) && fieldValue >= Validation.MinRange && fieldValue <= Validation.MaxRange))
		{
			return false;
		}
		else
		{
			return true;
		}
	};
	var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", 'RangeValidatorTest' + fieldName,
	fieldName, errMsg, "", evaluationfunction);
	fieldLabelControl.parent().addClass("required");
	window.Page_Validators.push(fieldRequiredValidator);
}

function addCombinationValidation(fieldName, requiredCheck, eventDateCheckbox)
{
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = window.$('#' + fieldName + '_label');
	var fieldLabel = fieldLabelControl.text();
	var errMsg = '<a href="#' + fieldName + '_label">This field is required</a>';
	var evaluationfunction = function ()
	{
		var fieldValue = window.$('#' + fieldName).val();
		var isRequiredChecked = window.$('#' + requiredCheck).is(":checked");
		var iseventDateChecked = window.$('#' + eventDateCheckbox).is(":checked");
		if (fieldValue === "" && !isRequiredChecked && iseventDateChecked)
		{
			return false;
		}
		else
		{
			return true;
		}
	};
	var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", 'RangeValidator' + fieldName, fieldName,
	errMsg, "", evaluationfunction);
	fieldLabelControl.parent().addClass("required");
	window.Page_Validators.push(fieldRequiredValidator);
}

function addCombinationValidationForRadio(fieldName, requiredCheck, eventDateCheckbox)
{
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = window.$('#' + fieldName + '_label');
	var fieldLabel = fieldLabelControl.text();
	var errMsg = '<a href="#' + fieldName + '_label">Please select an option.</a>';
	var evaluationfunction = function ()
	{
		var fieldValue = window.$("#" + fieldName).is(":checked");
		var isRequiredChecked = window.$("#" + requiredCheck).is(":checked");
		var iseventDateChecked = window.$("#" + eventDateCheckbox).is(":checked");
		if (fieldValue && !isRequiredChecked && !iseventDateChecked)
		{
			return false;
		}
		else
		{
			return true;
		}
	};
	var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", 'RangeValidator' + fieldName, fieldName,
	errMsg, "", evaluationfunction);
	window.Page_Validators.push(fieldRequiredValidator);
}

function rangeValidatorForYear(fieldName)
{
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = window.$('#' + fieldName + '_label');
	var fieldLabel = fieldLabelControl.text();
	var errMsg = '<a href="#' + fieldName + '_label"> Please enter a valid year between 1920 and today.</a>';
	var evaluationfunction = function ()
	{
		var fieldValue = window.$("#" + fieldName).val();
		var todayDate = new Date();
		if (fieldValue != "" && !window.$.isNumeric(fieldValue))
		{
			return false;
		}
		if (fieldValue != "" && (fieldValue < Validation.MinYear || fieldValue > todayDate.getFullYear()))
		{
			return false;
		}
		else
		{
			return true;
		}
	};
	var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", 'RangeValidator' + fieldName, fieldName,
	errMsg, "", evaluationfunction);
	window.Page_Validators.push(fieldRequiredValidator);
}

function specifyBlackoutDateValidation()
{
	var fieldName = "vr_blackoutseventdate";
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = $('#' + fieldName + '_label');
	var fieldLabel = fieldLabelControl.text();
	var msg = "Please enter a date equal to or before today's date";
	var errMsg = '<a href="#' + fieldName + '_label">' + msg + '</a > ';
	var evaluationfunction = function (e)
	{
		var fieldValue = $('#' + fieldName).val();
		var prevDate = $("#vr_previousblackouteventdate").val();
		if ($("#vr_blackouts_1").is(":checked") && !$("#vr_idontknowtheblackoutdate").is(":checked") && fieldValue ==
			"")
		{
			return false;
		}
		else if (prevDate != "" && fieldValue != "" && fieldValue < prevDate)
		{
			return false;
		}
		else
		{
			return true;
		}
	};
	var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", 'RangeValidator' + fieldName, fieldName,
	errMsg, "", evaluationfunction);
	window.Page_Validators.push(fieldRequiredValidator);
}

function specifyMultipleBlackoutDateValidation()
{
	var fieldName = "vr_previousblackouteventdate";
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = window.$('#' + fieldName + '_label');
	var fieldLabel = fieldLabelControl.text();
	var msg = "Please enter a date equal to or before today's date";
	var errMsg = '<a href="#' + fieldName + '_label">' + msg + '</a > ';
	var evaluationfunction = function (e)
	{
		var fieldValue = window.$('#' + fieldName).val();
		var date = window.$("#vr_blackoutseventdate").val();
		if (fieldValue != "" && date != "" && (fieldValue > date))
		{
			return false;
		}
		else
		{
			return true;
		}
	};
	var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", 'RangeValidator' + fieldName, fieldName,
	errMsg, "", evaluationfunction);
	window.Page_Validators.push(fieldRequiredValidator);
}

function specifySeziureDateValidation()
{
	var fieldName = "vr_seizuremostrecenteventdate";
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = $('#' + fieldName + '_label');
	var fieldLabel = fieldLabelControl.text();
	var errMsg = '<a href="#' + fieldName + '_label">Please enter a date equal to or after the Previous seizure.</a > ';
	var evaluationfunction = function (e)
	{
		var fieldValue = $('#' + fieldName).val();
		var prevDate = $("#vr_seizurepreviouseventdate").val();
		if ($("#vr_hadseizure_1").is(":checked") && !$("#vr_idontknowtheexactseizuredate").is(":checked") && fieldValue == "")
		{
			e.errormessage = e.errormessage.replace("Please enter a date equal to or after the Previous seizure",
				"Please enter a date equal to or before today's date");
			return false;
		}
		else if (prevDate != "" && fieldValue != "" && fieldValue < prevDate)
		{
			e.errormessage = e.errormessage.replace("Please enter a date equal to or before today's date",
				"Please enter a date equal to or after the Previous seizure");
			return false;
		}
		else
		{
			return true;
		}
	};
	var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", 'RangeValidator' + fieldName, fieldName,
	errMsg, "", evaluationfunction);
	window.Page_Validators.push(fieldRequiredValidator);
}

function specifyseziurePervioustDateValidation()
{
	var fieldName = "vr_seizurepreviouseventdate";
	if (typeof (window.Page_Validators) == "undefined") return;
	var fieldLabelControl = $('#' + fieldName + '_label');
	var fieldLabel = fieldLabelControl.text();
	var errMsg = '<a href="#' + fieldName +
		'_label">Please enter a date equal to or before the Most recent seizure.</a > ';
	var evaluationfunction = function ()
	{
		var fieldValue = window.$('#' + fieldName).val();
		var date = window.$("#vr_seizuremostrecenteventdate").val();
		if (fieldValue != "" && date != "" && (fieldValue > date))
		{
			return false;
		}
		else
		{
			return true;
		}
	};
	var fieldRequiredValidator = ReturnRequiredFieldValidator("span", "none", 'RangeValidator' + fieldName, fieldName,
	errMsg, "", evaluationfunction);
	window.Page_Validators.push(fieldRequiredValidator);
}
//Remove Validator for OOB

function removeValidatorForAided(fieldName)
{
	$.each(window.Page_Validators, function (index, validator)
	{
		if (validator.id == (fieldName + 'RequiredFieldValidator'))
		{
			window.Page_Validators.splice(index, 1);
		}
	});
}
//Enums
var YES = true;
var NO = false;
YESNODONTKNOW = {
	NO: "315780000",
	YES: "315780001",
	DONTKNOW: "315780002"
};
VisualAcuity = {
	Zero: 0,
	LessThanLimit: 9,
	LowerMid: 12,
	BetweenLimit: 13,
	MidValue: 10,
	UpperMid: 19,
	AroundMid: 18,
	LessThanMax: 24,
	MoreThanLimit: 25
};
Validation = {
	MaxRange: 150,
	ArsSize: 56,
	MinRange: 0,
	MinYear: 1920
};
ReportType = {
	MedicalGPReport: "315780000",
	EyesightReport: "315780001"
};
ReportStatus = {
	Active: "1",
	Draft: "315780006"
};
PDFGeneratedStatus = {
	Success: "315780000",
	Failed: "315780001"
};
Year = {
	OneYear: 1,
	FiveYears: 5,
	TenYears: 10
};
Month = {
	ThreeMonths: 3,
	SixMonths: 6,
	TwelveMonths: 12
};
Day = {
	OneDay: 1,
	FourWeeks: 28
};
Size = {
	One: 1,
	FiftyFive: 55,
	FiftySix: 56
};

function addNextOrBackValidation(currentTabIndex, newTabIndex)
{
	var isFormValid = formValidation(currentTabIndex, newTabIndex);
	if (isFormValid)
	{
		$(".inlineValidation").remove();
	}
	return isFormValid;
}
/*
 Validate Patient Details section only as there is no validation method for each section, only validation for the whole form.
 */
function ValidatePatientDetailsSection()
{
	if (ValidateRequiredFieldsOnPatientDetailsSection())
	{
		if (!$("#vr_idonthavethisinformation").is(':checked'))
		{
			return MatchCase();
		}
		else
		{
			sessionStorage.removeItem('customerid');
			sessionStorage.removeItem('preExistingConditions');
			return true;
		}
	}
	else
	{
		return false;
	}
}

function MatchCase()
{
	var match;
	var caseNumber = $("#vr_casenumber").val();
	var licenceNumber = $("#vr_vicroadsreferenceorlicencenumber").val();
	//remove the leading zero
	licenceNumber = Number(licenceNumber).toString();
	matchCaseNumberAndLicenceNumber(caseNumber, licenceNumber, (function (result)
	{
		if (result && result[0] && result[0].incidentid && result[0].incidentid != "")
		{
			window.$("#vr_incidentid").attr("class", "dirty");
			window.$("#vr_incidentid").attr("value", result[0].incidentid);
			window.$("#vr_incidentid_entityname").attr("value", "incident");
			sessionStorage.setItem("patientname", result[0].fullname);
			sessionStorage.setItem("customerid", result[0].customerid);
			match = true;
		}
		else
		{
			window.$("#ValidationSummaryEntityFormView").show();
			window.$("#ValidationSummaryEntityFormView").html(
				'<h4 class="validation-header"><span role="presentation" class="fa fa-info-circle"></span> The form could not be submitted for the following reasons:</h4><ul><li><a href="#vr_casenumber">Combination of licence number and case number is not valid. </a></li></ul>');
			sessionStorage.removeItem('customerid');
			sessionStorage.removeItem('preExistingConditions');
			match = false;
		}
	}));
	return match;
}

function ValidateRequiredFieldsOnPatientDetailsSection()
{
	var visionSectionRequiredValidatorList = [
        "MaximumLengthValidatorvr_visualacuityrighteyeunaided",
        "vr_visualacuityrighteyeunaidedRangeValidator",
        "MaximumLengthValidatorvr_visualacuitylefteyeunaided",
        "vr_visualacuitylefteyeunaidedRangeValidator",
        "MaximumLengthValidatorvr_visualacuitybinocularunaided",
        "vr_visualacuitybinocularunaidedRangeValidator",
        "vr_hasvisionoreyedisorderRequiredValidator",
        "vr_hasvisualfielddefectRequiredValidator",
        "vr_requirecorrectivelenseswhiledrivingRequiredValidator"
    ];
	var extractedValidators = extractValidatorsByIds(visionSectionRequiredValidatorList);
	var isPatientDetailsValid = window.Page_ClientValidate('');
	// Add extracted validators back
	for (var i = 0; i < extractedValidators.length; i++)
	{
		window.Page_Validators.push(extractedValidators[i]);
	}
	return isPatientDetailsValid;
}
//Recomendation Tab Script

function disableField(id)
{
	window.$('#' + id).attr("disabled", "disabled");
	window.$('#' + id).removeAttr("checked");
}

function enableField(id)
{
	window.$('#' + id).removeAttr("disabled", "disabled");
}

function diff_years(dt2, dt1)
{
	var date1 = (new Date(dt1));
	var date2 = (new Date(dt2 + " UTC"));
	var diff = Math.abs((date2.getTime() - date1.getTime()) / 1000);
	diff /= (60 * 60 * 24);
	var yearDiff = Math.abs(date1.getFullYear() - date2.getFullYear());
	var monthDiff = Math.abs(date1.getMonth() - date2.getMonth());
	var dateDiff = Math.abs(date1.getDate() - date2.getDate());
	if (monthDiff == 0 && dateDiff == 0)
	{
		return yearDiff;
	}
	return Math.ceil(diff / 365.25);
}

function diff_PrevMonths(dt2, dt1)
{
	if (dt2 == "" || dt1 == "")
	{
		return;
	}
	var usrDate = new Date(dt2 + " UTC");
	var curDate = new Date(dt1);
	var usrYear, usrMonth = usrDate.getMonth() + 1;
	var curYear, curMonth = curDate.getMonth() + 1;
	if ((usrYear = usrDate.getFullYear()) < (curYear = curDate.getFullYear()))
	{
		curMonth += (curYear - usrYear) * 12;
	}
	var diffMonths = curMonth - usrMonth;
	if (usrDate.getDate() < curDate.getDate())
	{
		diffMonths++;
	}
	return diffMonths;
}

function ReturnRequiredFieldValidator(
e, styleDisplay, validatorType, controlToValidate, errorMsg, initialvalue, evaluationFunction)
{
	var fieldRequiredValidator = document.createElement(e);
	fieldRequiredValidator.style.display = styleDisplay;
	fieldRequiredValidator.id = controlToValidate + validatorType;
	fieldRequiredValidator.controltovalidate = controlToValidate;
	fieldRequiredValidator.errormessage = errorMsg;
	fieldRequiredValidator.initialvalue = initialvalue;
	fieldRequiredValidator.evaluationfunction = evaluationFunction;
	return fieldRequiredValidator;
}

function isNumeric(event, obj)
{
	if (!event.key)
	{
		removeValidationMessage(obj);
		return false;
	}
	if (event.key && !isNaN(event.key))
	{
		removeValidationMessage(obj);
		return true;
	}
	else
	{
		addValidationMessage(obj, "Please enter Numbers Only");
		return false;
	}
}

function isPhoneNumber(event, obj)
{
	if (!event.key)
	{
		removeValidationMessage(obj);
		return false;
	}
	if (event.key && !isNaN(event.key))
	{
		removeValidationMessage(obj);
		return true;
	}
	else
	{
		addValidationMessage(obj, "Please enter a valid phone number");
		return false;
	}
}

function isRange(event, obj)
{
	var inputValue = window.$(obj).val().trim();
	if (inputValue === "")
	{
		removeValidationMessage(obj);
		return true;
	}
	if (!($.isNumeric(inputValue)) || inputValue > 150)
	{
		addValidationMessage(obj, "Please enter a number between 0 and 150");
		return false;
	}
	else
	{
		removeValidationMessage(obj);
		return true;
	}
}

function isLettersOnly(event, obj)
{
	//var regex = /^[A-Za-z]+$/;
	//!regex.test($(obj).val();
	var inputValue = event.which;
	if (!(inputValue >= 65 && inputValue <= 120) && (inputValue != 32 && inputValue != 0))
	{
		addValidationMessage(obj, "Please enter valid characters");
		return false;
	}
	else
	{
		removeValidationMessage(obj);
		return true;
	}
}

function isRequired(event, obj)
{
	//var regex = /^[A-Za-z]+$/;
	//!regex.test($(obj).val();
	var inputValue = $(obj).val().trim();
	if (inputValue === "")
	{
		addValidationMessage(obj, "This field is required");
		return false;
	}
	else
	{
		removeValidationMessage(obj);
		return true;
	}
}

function isRequiredWithCustomMessage(event, obj, message)
{
	//var regex = /^[A-Za-z]+$/;
	//!regex.test($(obj).val();
	var inputValue = $(obj).val().trim();
	if (inputValue === "")
	{
		addValidationMessage(obj, message);
		return false;
	}
	else
	{
		removeValidationMessage(obj);
		return true;
	}
}

function isValidName(event, obj, message)
{
	var regMatch = /^[A-Za-z'\s-]+$/;
	var value = $(obj).val();
	if (!regMatch.test(value))
	{
		addValidationMessage(obj, message);
		return false;
	}
	else
	{
		removeValidationMessage(obj);
		return true;
	}
}

function addValidationMessage(obj, message)
{
	window.$(obj).closest('td').find('.inlineValidation').remove();
	window.$(obj).closest('td').append(
		'<div class="validation-summary alert alert-error alert-danger alert-block inlineValidation">' + message +
		'</div>');
	window.$(obj).closest('td').addClass('alert-error-control');
}

function removeValidationMessage(obj)
{
	window.$(obj).closest('td').find('.inlineValidation').remove();
	window.$(obj).closest('td').removeClass('alert-error-control');
}

function validateEmail(obj)
{
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	var value = $(obj).val();
	if (!emailReg.test(value))
	{
		addValidationMessage(obj, "Please enter a valid email address");
		return false;
	}
	else
	{
		removeValidationMessage(obj);
		return true;
	}
}

function validateYear(obj)
{
	var fieldValue = window.$(obj).val();
	var todayDate = new Date();
	if (fieldValue !== "" && !window.$.isNumeric(fieldValue))
	{
		addValidationMessage(obj, "Please enter valid year");
		return false;
	}
	if (fieldValue != "" && (fieldValue < Validation.MinYear || fieldValue > todayDate.getFullYear()))
	{
		addValidationMessage(obj, "Please enter a valid year between 1920 and today");
		return false;
	}
	else
	{
		removeValidationMessage(obj);
		return true;
	}
}
/**
 * Extract Validators By Ids
 * @param {Array} idArray array contain validator ids
 * @returns {Array} the extracted Validators in an array
 */

function extractValidatorsByIds(idArray)
{
	var extractedValidatorsArray = [];
	for (var a = 0, len = idArray.length; a < len; a++)
	{
		var validatorId = idArray[a];
		if ($('#' + validatorId) !== "undefined")
		{
			var result = window.Page_Validators.filter(function (v)
			{
				return v.id.indexOf(validatorId) !== -1;
			});
			if (result.length > 0)
			{
				extractedValidatorsArray.push(result[0]);
				removeValidatorById(validatorId);
			}
		}
	}
	return extractedValidatorsArray;
}
/**
 * Display Error Message from CRM (workflow or plugin)
 * @param {any} fieldName where the error message display below
 * @returns {boolean} is an error message displayed
 */

function displayCrmErrorMessage(fieldName)
{
	var errorMessage = $('.text-danger').text();
	if (errorMessage !== "")
	{
		setErrorMessage(fieldName, errorMessage);
		return true;
	}
	return false;
}

function isAlphanumeric(event, obj, message)
{
	var regMatch = /^[0-9a-zA-Z]+$/;
	var value = $(obj).val();
	if (!regMatch.test(value))
	{
		if (message == "" || message == "undefined")
		{
			addValidationMessage(obj, "Please enter alphanumeric characters only");
		}
		else
		{
			addValidationMessage(obj, message);
		}
		return false;
	}
	else
	{
		removeValidationMessage(obj);
		return true;
	}
}

function isValidLicenceNumber(event, obj)
{
	var regMatch = /^\d{3,9}$/;
	var value = window.$(obj).val().trim();
	if (value === "")
	{
		addValidationMessage(obj, "This field is required");
		return false;
	}
	else if (!regMatch.test(value))
	{
		addValidationMessage(obj, "Please enter a valid Victorian driver licence number. The number must be 3-9 digits with no spaces or non-numeric characters");
		return false;
	}
	else
	{
		removeValidationMessage(obj);
		return true;
	}
}

function isValidCaseNumber(event, obj)
{
	var regMatch = /^[A-Za-z]{2}[-][0-9]{7}$/;
	var value = window.$(obj).val().trim();
	if (value === "")
	{
		addValidationMessage(obj, "This field is required");
		return false;
	}
	else if (!regMatch.test(value))
	{
		addValidationMessage(obj, "Please enter a valid case number");
		return false;
	}
	else
	{
		removeValidationMessage(obj);
		return true;
	}
}

function isValidYearRange(event, obj)
{
	var currentYear = new Date().getFullYear().toString().split("");
	var regMatch = new RegExp("^(19[2-9][0-9]|200[0-9]|[0-" + currentYear[0] + "][0-" + currentYear[1] + "][0-" + currentYear[2] + "][0-" + currentYear[3] + "])$");
	var value = window.$(obj).val().trim();
	if (value != "" && !regMatch.test(value))
	{
		addValidationMessage(obj, "Please enter a valid year between 1920 and today.");
		return false;
	}
	else
	{
		removeValidationMessage(obj);
		return true;
	}
}
// CMPP-5180 Changes - Return names of the attachment files uploaded to a medical report record

function getAttachmentFileNames(medicalreportnumberId, callback)
{
	var request;
	var url = '/GetMedicalReportAttachmentNames?medicalreportnumberid=' + medicalreportnumberId;
	$.ajax(
	{
		type: "GET",
		dataType: "json",
		url: url,
		async: false,
		beforeSend: function (xhr)
		{
			request = xhr;
		},
		success: callback,
		error: function (xmlHttpRequest, textStatus, errorThrown)
		{
			console.log(xmlHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}
// CMPP-3805 Changes - Return medical condition record associated with the given customer

function getMedicalCondition(customerId, callback)
{
	var request;
	var url = '/GetMedicalConditions?customerId=' + customerId;
	$.ajax(
	{
		type: "GET",
		dataType: "json",
		url: url,
		async: false,
		beforeSend: function (xhr)
		{
			request = xhr;
		},
		success: callback,
		error: function (xmlHttpRequest, textStatus, errorThrown)
		{
			console.log(xmlHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}
// CMPP-3805 Changes - Return medical event records associated with the given customer

function getMedicalEvent(customerId, callback)
{
	var request;
	var url = '/GetMedicalEvents?customerId=' + customerId;
	$.ajax(
	{
		type: "GET",
		dataType: "json",
		url: url,
		async: false,
		beforeSend: function (xhr)
		{
			request = xhr;
		},
		success: callback,
		error: function (xmlHttpRequest, textStatus, errorThrown)
		{
			console.log(xmlHttpRequest);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
}
MedicalConditionText = {
	VisionEyeDisorders: "Vision & eye disorders",
	Blackouts: "Blackout/s",
	Cardiovascular: "Cardiovascular",
	Diabetes: "Diabetes",
	MusculoskeletalDisorders: "Musculoskeletal disorders",
	Dementia: "Dementia or other cognitive impairment",
	SeizureEpilepsy: "Seizures and epilepsy",
	Neurological: "Neurological conditions",
	MentalHealth: "Mental health issues",
	SleepDisorders: "Sleep disorders",
	SubstanceMisuse: "Substance misuse",
	HearingLoss: "Hearing loss",
	PrefixText: "Pre-existing conditions: "
}
// CMPP-3805 As a MR Officer I want to ensure medical practitioners completing eForms cover existing and new medical conditions

function setMedicalConditions()
{
	// Vision and eye disorder
	var visionConditions = ["vr_cataracts", "vr_diabeticretinopathy", "vr_diplopia", "vr_glaucoma", "vr_hemianopia", "vr_maculardegeneration",
        "vr_monocularvision", "vr_nystagmus", "vr_opticneuropathy", "vr_quadrantanopia", "vr_retinitispigmentosa",
        "vr_hasvisualfielddefect", "vr_otherspecify_vision"];
	// Blackout/s
	var blackoutConditions = ["vr_syncope"];
	var blackoutMedicalEvents = ["315780001"]; // Blackout/s
	// Cardiovascular
	var cardiovascularConditions = ["vr_abdominalthoracicaneurysm", "vr_angina", "vr_atrialfibrillationaf", "vr_cardiomyopathy",
        "vr_congenitaldisorders", "vr_coronaryarterydisease", "vr_heartfailure", "vr_hypertension", "vr_ischaemicheartdisease",
        "vr_paroxysmalarrhythmias", "vr_peripheralvasculardisease", "vr_valvularheartdisease", "vr_otherspecify_cardiovascular",
        "vr_angioplasty", "vr_cardiacpacemaker", "vr_cardiacdefibrillator", "vr_anticoagulanttherapy", "vr_hearttransplant", "vr_cabg", "vr_pci", "vr_vad"];
	var cardiovascularMedicalEvent = ["315780000", "315780002"]; // AMI, Cardiac Arrest (CA)
	// Diabetes
	var diabetesConditions = ["vr_diabetes"];
	// Musculoskeletal Disorder
	var musculoskeletalDisordersConditions = ["vr_chronicpainsyndrome", "vr_fibromyalgia", "vr_leftlegleftarmdisability", "vr_lossoflegfunctionboth",
        "vr_lossoflimbfunction", "vr_lossofrightlegfunction", "vr_osteoarthritis", "vr_reducedlowerlimbstrength", "vr_reducedupperlimbstrength",
        "vr_shortlegs", "vr_shortstature", "vr_spinalcordinjury", "vr_otherspecify_musculoskeletal"];
	// Dementia
	var dementiaConditions = ["vr_dementiaalzheimers"];
	// Seizure & Epilepsy
	var seizureAndEpilepsyConditions = ["vr_epilepsy"];
	var seizureAndEpilepsyMedicalEvents = ["315780004"]; // Seizure
	// Neurological Conditions
	var neurologicalConditions = ["vr_aneurysmintracranial", "vr_cerebralpalsy", "vr_intellectualdisability", "vr_menieresdisease",
        "vr_multiplesclerosisms", "vr_musculardystrophy", "vr_parkinsonsdisease", "vr_peripheralneuropathy", "vr_sol", "vr_sah",
        "vr_otherspecify_neurological"];
	var neurologicalMedicalEvents = ["315780003", "315780005"]; // Head Injury/ABI, Stroke/ CVA/ICH
	// Mental Health
	var mentalHealthConditions = ["vr_anxiety", "vr_milddepression", "vr_chronicpsychconditions"];
	// Sleep Disorders
	var sleepDisordersConditions = ["vr_narcolepsycataplexy", "vr_sleepapnoea", "vr_otherspecify_sleep"];
	// Substance Misuse
	var substanceMisuseConditions = ["vr_substanceuse", "vr_otherspecify_substance"];
	// Hearing Loss
	var hearingLossConditions = ["vr_hearingloss"];
	var preExistingConditions = "";
	if (!window.$("#vr_idonthavethisinformation").is(":checked"))
	{
		var customerId = sessionStorage.getItem("customerid");
		// Get medical conditions associated with the customer
		getMedicalCondition(customerId, (function (result)
		{
			if (result && result.length > 0)
			{
				var customerExistingMedicalConditions = result[0];
				var customerExistingMedicalEvents;
				// Get medical events associated with the customer
				getMedicalEvent(customerId, (function (resultEvents)
				{
					if (resultEvents && resultEvents.length > 0)
					{
						customerExistingMedicalEvents = resultEvents;
					}
				}));
				// Check for Vision and eye disorder conditions 
				if (checkIfMedicalConditionExists(visionConditions, customerExistingMedicalConditions)) preExistingConditions += MedicalConditionText.VisionEyeDisorders + ", ";
				if (isMedicalReport())
				{ // Below pre-exisitng conditions to be shown only for Medical Report, not Eyesight Report
					// Check for blackout/s conditions and any blackout medical event
					if (checkIfMedicalConditionExists(blackoutConditions, customerExistingMedicalConditions) || checkIfMedicalEventExists(blackoutMedicalEvents, customerExistingMedicalEvents)) preExistingConditions += MedicalConditionText.Blackouts + ", ";
					// Check for cardiovascular conditions and any cardiovascular medical event
					if (checkIfMedicalConditionExists(cardiovascularConditions, customerExistingMedicalConditions) || checkIfMedicalEventExists(cardiovascularMedicalEvent, customerExistingMedicalEvents)) preExistingConditions += MedicalConditionText.Cardiovascular + ", ";
					// Check for diabetes condition 
					if (checkIfMedicalConditionExists(diabetesConditions, customerExistingMedicalConditions)) preExistingConditions += MedicalConditionText.Diabetes + ", ";
					// Check for musculoskelatal condition 
					if (checkIfMedicalConditionExists(musculoskeletalDisordersConditions, customerExistingMedicalConditions)) preExistingConditions += MedicalConditionText.MusculoskeletalDisorders + ", ";
					// Check for dementia conditions
					if (checkIfMedicalConditionExists(dementiaConditions, customerExistingMedicalConditions)) preExistingConditions += MedicalConditionText.Dementia + ", ";
					// Check for seizure and epilepsy conditions and any seizure medical event
					if (checkIfMedicalConditionExists(seizureAndEpilepsyConditions, customerExistingMedicalConditions) || checkIfMedicalEventExists(seizureAndEpilepsyMedicalEvents, customerExistingMedicalEvents)) preExistingConditions += MedicalConditionText.SeizureEpilepsy + ", ";
					// Check for neurological conditions and any neurological medical event
					if (checkIfMedicalConditionExists(neurologicalConditions, customerExistingMedicalConditions) || checkIfMedicalEventExists(neurologicalMedicalEvents, customerExistingMedicalEvents)) preExistingConditions += MedicalConditionText.Neurological + ", ";
					// Check for mental health conditions 
					if (checkIfMedicalConditionExists(mentalHealthConditions, customerExistingMedicalConditions)) preExistingConditions += MedicalConditionText.MentalHealth + ", ";
					// Check for sleep disorder conditions 
					if (checkIfMedicalConditionExists(sleepDisordersConditions, customerExistingMedicalConditions)) preExistingConditions += MedicalConditionText.SleepDisorders + ", ";
					// Check for substance misuse conditions 
					if (checkIfMedicalConditionExists(substanceMisuseConditions, customerExistingMedicalConditions)) preExistingConditions += MedicalConditionText.SubstanceMisuse + ", ";
					// Check for hearing loss conditions 
					if (checkIfMedicalConditionExists(hearingLossConditions, customerExistingMedicalConditions)) preExistingConditions += MedicalConditionText.HearingLoss + ", ";
				}
				if (preExistingConditions != "") preExistingConditions = MedicalConditionText.PrefixText + preExistingConditions.slice(0, -2);
			}
		}));
		sessionStorage.setItem("preExistingConditions", preExistingConditions);
	}
	else
	{
		sessionStorage.removeItem("customerid");
		sessionStorage.removeItem("preExistingConditions");
	}
	displayPreExistingMedicalConditions();
}
// Displays the Pre-existing Conditions in the header section

function displayPreExistingMedicalConditions()
{
	if (sessionStorage.getItem("preExistingConditions") != null) window.$("#preExistingConditions").text(sessionStorage.getItem("preExistingConditions"));
	else window.$("#preExistingConditions").text("");
}
// Returns true if any one of the specified medical conditions is selected in the medical report

function checkIfMedicalConditionExists(conditions, customerExistingMedicalConditions)
{
	if (conditions != null && customerExistingMedicalConditions != null)
	{ // Null check added
		for (var i = 0; i < conditions.length; i++)
		{
			if (customerExistingMedicalConditions[conditions[i]] == "true") return true;
		}
	}
	return false;
}
// Returns true if any one of the specified medical events exist for the customer

function checkIfMedicalEventExists(medicalEventConditions, customerExistingMedicalEvents)
{
	if (medicalEventConditions != null && customerExistingMedicalEvents != null)
	{ // Null check added
		for (var i = 0; i < medicalEventConditions.length; i++)
		{
			for (var j = 0; j < customerExistingMedicalEvents.length; j++)
			{
				if (customerExistingMedicalEvents[j]["vr_medicaleventtype"] == medicalEventConditions[i]) return true;
			}
		}
	}
	return false;
}
// Clear session variables after report is submitted

function clearSessionVariables()
{
	sessionStorage.removeItem("customerid");
	sessionStorage.removeItem("preExistingConditions");
}
//CMPP-6163 Text area max length validation

function addMaxCharLimitValidation(fieldName, charlimit)
{
	var evaluationfunction = function ()
	{
		var fieldValue = window.$('#' + fieldName).val();
		var nChar = fieldValue.match(/[^\r\n]/g);
		var nCRLF = fieldValue.match(/\r*\n/g);
		if (nChar != null)
		{
			nChar = nChar.length;
		}
		else
		{
			nChar = 0;
		}
		if (nCRLF != null)
		{
			nCRLF = nCRLF.length * 2;
		}
		else
		{
			nCRLF = 0;
		} // Carriage returns are considered as 2 characters by browser
		var totalCount = nChar + nCRLF;
		if (totalCount > charlimit)
		{
			return false;
		}
		else
		{
			return true;
		}
	};
	createValidator(fieldName, "addMaxCharLimitValidation", "Exceeds the maximum length of " + charlimit + " characters.", evaluationfunction);
}
// Returns true if the current report type is Medical Report

function isMedicalReport()
{
	if (sessionStorage.getItem("reporttype") == "Medical Report") return true;
	return false;
}

// CMPP-6159 RETURNS DRAFT REPORTS 
function getDraftReports(sessionkey, callback) {
    var url = '/getDraftReports?sessionkey=' + sessionkey;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
        async: false,
        beforeSend: function (xhr) {
            request = xhr;
        },
        success: callback,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

// RETURNS THE DIFFERENCE BETWEEN TWO DATES IN MINUTES
function getMinutesBetweenDates(startDate, endDate) {
    var diff = endDate.getTime() - startDate.getTime();
    return (diff / 60000);
}

// SET UP INLINE VALIDATIONS FOR ENTITY FORMS
function makeValidationsInlineForEntityForm() {
    $("#ValidationSummaryEntityFormControl_EntityFormView").find('li').each(function (index) {
        var id = $(this).find('a').attr('href').replace('_label', '');
        var message = $(this).find('a').html();
        if (!$(id).closest('td').find(".inlineValidation").html()) {
            $(id).closest('td').append(
                '<div class="validation-summary alert alert-error alert-danger alert-block inlineValidation">' +
                message + '</div>');
            $(id).closest('td').addClass('alert-error-control');
        }
    });
    $("#ValidationSummaryEntityFormControl_EntityFormView").hide();
}

// ATTACH INLINE VALIDATIONS FOR ENTITY FORMS
function attachInlineValidationsForEntityForm() {
    var mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length > 0 && mutation.addedNodes.length == 2) {
                $(".inlineValidation").remove();
                makeValidationsInlineForEntityForm();
            }
        });
    });
    // Starts listening for changes in the root HTML element of the page.
    mutationObserver.observe(document.getElementById("ValidationSummaryEntityFormControl_EntityFormView"), {
        attributes: true,
        characterData: true,
        childList: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true
    });
}

// RETRIVE THE PARAMETER VALUE FROM URL
function getURLParam(key) {
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);

        return results != null ? results[1] : "";
    }
    return decodeURIComponent($.urlParam(key));
}

// CMPP-6159 Changes - Return practitioner details based on logged in practitioner session
function getPractitionerDetails(sessionkey, callback) {
    var request;
    var url = '/GetPractitionerDetails?sessionkey=' + sessionkey;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: url,
        async: false,
        beforeSend: function (xhr) {
            request = xhr;
        },
        success: callback,
        error: function (xmlHttpRequest, textStatus, errorThrown) {
            console.log(xmlHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        } 
    });
}

// Add save as draft button
function addActionButton(buttonCode) {
	var defaultButtonCode = "<input type=\"button\" name=\"SaveDraftButton\" value=\"SaveDraft\" onclick=\"alert(\"Hellos\");\" id=\"SaveDraftButton\" class=\"btn btn-default button save-draft save-draft-btn\"></input>";

	buttonCode = (buttonCode != "") ? buttonCode : defaultButtonCode;

	//check if an empty next button parent container is affecting layout
	if($("#NextButton").is(":hidden")){
		$("#NextButton").parent().hide();
	}

	if (buttonCode != "") {
		outputHTML = "<div role=\"group\" class=\"btn-group entity-action-button\">" + buttonCode + "</div>";

		if ($("#WebFormPanel > div.actions > div > div.btn-group").length === 1) {
			$('#WebFormPanel > div.actions > div > .btn-group:first-of-type').before(outputHTML);
	 	} else {
			 $('#WebFormPanel > div.actions > div > .btn-group:first-of-type').after(outputHTML);
			 $('#WebFormPanel > div.actions > div').css({"display":"flex", "justify-content":"space-between"});
	 	}
	}
}