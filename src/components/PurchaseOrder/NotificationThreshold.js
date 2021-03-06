/**
 * Created by Hong HP on 4/24/19.
 */


import React, {useEffect, useState} from 'react';
import {Text, TextInput, View, StyleSheet, TouchableOpacity} from 'react-native';
import {FontNames} from '../../theme/fonts';
import {AppColors} from '../../theme/colors';
import {addPurchaseOrderSettings, updatePurchaseOrderSettings} from '../../services/poService';

let POSetting = ''
export default function NotificationThreshold(props) {

  const [numberThresholds, setNumberThresholds] = useState(0)
  const [expiryDate, setExpiryDate] = useState(0)
  const [disabled, setDisabled] = useState(true)
  const [isUpdate, setIsUpdate] = useState(false)
  useEffect(() => {
    POSetting = props.navigation.getParam('POSetting', {})
    setNumberThresholds(POSetting.numberThresholds || '')
    setExpiryDate(POSetting.numberDayBeforeExpiry || '')
    if (POSetting.id) setIsUpdate(true)
  }, [])

  useEffect(() => {
    if (numberThresholds && expiryDate) {
      setDisabled(false)
    } else {
      if (!disabled) {
        setDisabled(true)
      }
    }
  })

  function addPOSetting() {
    let data = {
      programId: POSetting.programId,
      userSpId: POSetting.userSpId,
      numberThresholds: numberThresholds,
      numberDayBeforeExpiry: expiryDate
    }
    addPurchaseOrderSettings(data).then((data) => {
      if (data.statusCode === 200) {
        let getListPO = props.navigation.getParam('getListPO')
        if (getListPO) getListPO()
        props.navigation.pop()
      }
    })
  }

  function updatePOSetting() {
    let data = {
      ...POSetting,
      numberThresholds: numberThresholds,
      numberDayBeforeExpiry: expiryDate
    }
    updatePurchaseOrderSettings(POSetting.id, data).then((data) => {
      if (data.statusCode === 200) {
        let getListPO = props.navigation.getParam('getListPO')
        if (getListPO) getListPO()
        props.navigation.pop()
      }
    })
  }

  return <View style={styles.container}>
    <Text style={[styles.textStyle, {marginTop: 25, marginBottom: 10}]}>Send email when PO Units current date is</Text>
    <TextInput style={styles.textInputStyle}
               value={numberThresholds.toString()}
               onChangeText={(text) => {
                 setNumberThresholds(text)
               }}
    />
    <Text style={[styles.textStyle, {marginTop: 25, marginBottom: 10}]}>Send email when current date is</Text>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TextInput
        style={styles.textInputStyle}
        value={expiryDate.toString()}
        onChangeText={(text) => setExpiryDate(text)}
      />
      <Text style={styles.textStyle}>days before expiry date.</Text>
    </View>
    <TouchableOpacity style={[styles.button, {backgroundColor: disabled ? '#d9d9d9' : AppColors.blueBackgroundColor}]}
                      onPress={() => {
                        if (POSetting.id) {
                          updatePOSetting()
                        } else {
                          addPOSetting()
                        }
                      }}
                      disabled={disabled}
    >
      <Text
        style={[styles.textStyle, {color: disabled ? '#333333' : '#fff'}]}>{isUpdate ? 'Save Changes' : 'Add'}</Text>
    </TouchableOpacity>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  textInputStyle: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#9d9d9d',
    borderRadius: 4,
    width: 56,
    height: 40,
    textAlign: 'center',
    marginRight: 15
  },
  button: {
    backgroundColor: '#d9d9d9',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 44
  },
  textStyle: {
    color: AppColors.black60,
    fontSize: 16,
    fontFamily: FontNames.RobotoRegular,
  }
})