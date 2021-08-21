import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, TouchableOpacity, Image, Button} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import useColorScheme from "../hooks/useColorScheme";
import Navigation from "../navigation";
import { useNavigation } from "@react-navigation/native";

const ProfileCreation = () => {
  const [nameInput, setNameInput] = useState("")
  const [isSubmitted, submitProfile] = useState(false);

  const [yearOpen, setYearOpen] = useState(false);
  const [yearValue, setYearValue] = useState(null);
  const [yearItems, setYearItems] = useState([
    {label: 'First Year', value: '1'},
    {label: 'Second Year', value: '2'},
    {label: 'Third Year', value: '3'},
    {label: 'Fourth Year', value: '4'}
  ]);

  // variable collegeItems can be updated with funciton setCollegeItems, initializaed as list of label, value pairs
  const [majorOpen, setMajorOpen] = useState(false);
  const [majorValue, setMajorValue] = useState(null);
  const [majors, setMajors] = useState([
    {label: 'Accounting', value: 'Accounting'},
    {label: 'Computer Science', value: 'Computer Science'},
    {label: 'Biology', value: 'Biology'},
    {label: 'English', value: 'English'},
    {label: 'Chemistry', value: 'Chemistry'},
    {label: 'Psychology', value: 'Psychology'},
    {label: 'Engineering', value: 'Engineering'},
    {label: 'Political Science', value: 'Political Science'},
    {label: 'Management', value: 'Management'},
  ]);

  // add BADGE mode
  const [interestsOpen, setInterestsOpen] = useState(false);
  const [interestsValue, setInterestsValue] = useState(null);
  const [interests, setInterests] = useState([
    {label: 'Acting', value: 'Acting'},
    {label: 'Archery', value: 'Archery'},
    {label: 'Backpacking', value: 'Backpacking'},
    {label: 'Basketball', value: 'Basketball'},
    {label: 'Camping', value: 'Camping'},
    {label: 'Chess', value: 'Chess'},
    {label: 'Dancing', value: 'Dancing'},
    {label: 'Fishing', value: 'Fishing'},
    {label: 'Guitar', value: 'Guitar'},
  ]);

  // useEffect(() => {
  //   (async () => {
  //     if (Platform.OS !== 'web') {
  //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //       if (status !== 'granted') {
  //         alert('Sorry, we need camera roll permissions to make this work!');
  //       }
  //     }
  //   })();
  // }, []);;

  const onYearOpen = useCallback(() => {
    setMajorOpen(false);
    setInterestsOpen(false);
  }, []);

  const onMajorOpen = useCallback(() => {
    setYearOpen(false);
    setInterestsOpen(false);
  }, []);

  const onInterestsOpen = useCallback(() => {
    setMajorOpen(false);
    setYearOpen(false);
  }, []);

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   if (!result.cancelled) {
  //     setImage(result.uri);
  //   }
  // };

  const saveButton = () => {
    console.log("blah")
    console.log(nameInput);  //replace with ACTUAL graphql operations to fill out user and profile tables. PLEASE.
    console.log(yearValue);  //required field checking yeah that sort of thing.
    console.log(majorValue);
    console.log(interestsValue);
    submitProfile(true);
    //return (<Navigation colorScheme={useColorScheme()} />);
  }
  const colorScheme = useColorScheme();
  if (isSubmitted) {
    return (
      <Navigation colorScheme={colorScheme} />
    );
  }

  return (
    <SafeAreaView>
      
      <TextInput
        style={styles.input}
        onChangeText={input => setNameInput(input)}
        placeholder="name"
      />

      <DropDownPicker
        style={styles.input}
        open={yearOpen}
        onOpen={onYearOpen}
        value={yearValue}
        onChangeValue={(value) => {
          setYearValue(value);
        }}
        items={yearItems}
        setOpen={setYearOpen}
        setValue={setYearValue}
        setItems={setYearItems}
        zIndex={3}
      />

      <DropDownPicker
        style={styles.input}
        open={majorOpen}
        onOpen={onMajorOpen}
        value={majorValue}
        onChangeValue={(value) => {
          setMajorValue(value);
        }}
        items={majors}
        setOpen={setMajorOpen}
        setValue={setMajorValue}
        setItems={setMajors}
        searchable={true}
        searchablePlaceholder="Search..."
        searchableError="Not Found"
        zIndex={2}
      />

      <DropDownPicker
        style={styles.input}
        open={interestsOpen}
        onOpen={onInterestsOpen}
        value={interestsValue}
        onChangeValue={(value) => {
          setInterestsValue(value)
        }}
        items={interests}
        setOpen={setInterestsOpen}
        setValue={setInterestsValue}
        setItems={setInterests}
        multiple={true}
        min={0}
        max={10}
        searchable={true}
        searchablePlaceholder="Search..."
        searchableError="Not Found"
        zIndex={1}
      />

      <Button
        style = {styles.imagePicker}
        onPress = {() => saveButton()}
        title = "Submit"
        zIndex = {0}
      >
        Submit
      </Button>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  imagePicker: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    borderRadius: 400
  }
});

export default ProfileCreation;
