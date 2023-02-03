/*  _______           __ _______               __         __   
   |   |   |.-----.--|  |   _   |.-----.-----.|__|.-----.|  |_ 
   |       ||  _  |  _  |       ||__ --|__ --||  ||__ --||   _|
   |__|_|__||_____|_____|___|___||_____|_____||__||_____||____|
   (c) 2022-present FSG Modding.  MIT License. */

// Folder window UI

/* global processL10N, fsgUtil */

let thisCollection = null

window.mods.receive('fromMain_collectionName', (modCollect) => {
	thisCollection = modCollect.opts.collectKey
	
	fsgUtil.byId('collection_name').innerHTML = modCollect.collectionToName[thisCollection]

	fsgUtil.query('input').forEach((element) => {
		let thisValue = ''
		
		let thisPlaceholder = modCollect.opts.lastGameSettings[element.id.replace('notes_', '')]
		if ( typeof modCollect.collectionNotes[thisCollection] !== 'undefined' ) {
			thisValue       = modCollect.collectionNotes[thisCollection][element.id]
			thisPlaceholder = ( typeof thisValue !== 'undefined' ) ? '' : thisPlaceholder
		}
		if ( element.getAttribute('type') === 'checkbox' ) {
			element.checked = (thisValue !== '') ? thisValue : false
		} else {
			element.placeholder = ( typeof thisPlaceholder !== 'undefined' ) ? thisPlaceholder : ''
			element.value =  ( typeof thisValue !== 'undefined' ) ? thisValue : ''
		}

		clientCheckValid(element.id)
	})
	
	if ( typeof modCollect.collectionNotes[thisCollection] !== 'undefined' ) {
		fsgUtil.byId('notes_notes').innerHTML = modCollect.collectionNotes[thisCollection].notes_notes || ''
	}

	processL10N()
})

function clientCheckValid(id, inProgress = false) {
	
	const formControl  = fsgUtil.byId(id)
	const formValue    = formControl.value
	const formFeedback = fsgUtil.byId(`${id}_feedback`)

	let validCheck = true

	switch ( id ) {
		case 'notes_website' :
			if (! ( formValue === '' || ( formValue.startsWith('http') && formValue.endsWith('/') ))) {
				validCheck = false
			}
			break
		case 'notes_password' :
			if ( formValue.length > 16 ) { validCheck = false }
			break
		case 'notes_username' :
			if ( formValue.length > 30 ) { validCheck = false }
			break
		default :
			break
	}

	if ( formFeedback !== null ) {
		if ( validCheck ) {
			formFeedback.classList.add('d-none')
		} else {
			formFeedback.classList.remove('d-none')
		}
	}

	if ( validCheck && !inProgress ) {
		formControl.classList.add('is-valid')
		formControl.classList.remove('is-invalid')
	} else {
		formControl.classList.remove('is-valid')
		formControl.classList.add('is-invalid')
	}
}

function clientMarkIP(id) {
	clientCheckValid(id, true)
}

function clientSetNote(id) {
	const formControl = fsgUtil.byId(id)
	
	if ( formControl.getAttribute('type') === 'checkbox' ) {
		window.mods.setNote(id, formControl.checked, thisCollection)
	} else {
		window.mods.setNote(id, formControl.value, thisCollection)
	}
}