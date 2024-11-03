import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { UserService } from '../../../services/user.service';


interface Step {
  title: string;
  description: string;
  options: string[];
  isLocationStep:boolean
}

@Component({
  selector: 'app-user-onboarding',
  templateUrl: './user-onboarding.component.html',
  styleUrl: './user-onboarding.component.css'
})
export class UserOnboardingComponent {
  userData: any;
  currentStepIndex: number = 0;
  map!: L.Map;
  marker!: L.Marker;
  isMapLoading: boolean = false; 
  onboardData = {
    specialization: '',
    experience: '',
    association: '',
    location: ''
  };
  showSuccessPopup: boolean = false;
  isOptionSelected: boolean = false;
  selectedOption: string = '';
  isLoading = false;


  selectedOptions: { [key: number]: string } = {};

  constructor(private router: Router, private userService:UserService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { userData: any };
    this.userData = state?.userData || {};
  }

  steps: Step[] = [
    {
      title: 'What is your area of specialization?',
      description: 'Lorem ipsum dolor sit amet consectetur. Magna tempus molestie amet non massa',
      options: [
        'General Dentistry', 'Orthodontics', 'Periodontics', 'Oral Surgery', 
        'Endodontics', 'Prosthodontics', 'Pediatric Dentistry', 'Oral Pathology', 
        'Oral and Maxillofacial Surgery'
      ],
      isLocationStep:false
    },
    {
      title: 'How many years of experience do you have',
      description: 'Lorem ipsum dolor sit amet consectetur. Magna tempus molestie amet non massa',
      options: ['1 Year', '2 Year', '3 Year', '5 Year', '6+ Years'],
      isLocationStep:false
    },
    {
      title: 'Are you associated with any clinics or hospitals?',
      description: 'Lorem ipsum dolor sit amet consectetur. Magna tempus molestie amet non massa',
      options: ['Yes', 'No'],
      isLocationStep:false
    },
    {
      title: 'What is your primary practice location?',
      description: 'Lorem ipsum dolor sit amet consectetur. Magna tempus molestie amet non massa',
      options: [], // No options for location step
      isLocationStep: true
    }
    
    // Add more steps as needed
  ];

  get currentStep(): Step {
    return this.steps[this.currentStepIndex];
  }

  ngAfterViewInit(): void {
    if (this.currentStep.isLocationStep) {
      this.initializeMap();
    }
  }

  initializeMap(): void {
    this.map = L.map('map').setView([40.7128, -74.0060], 10); // Default to NYC

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);
    this.isMapLoading = false;

    this.marker = L.marker([40.7128, -74.0060]).addTo(this.map); // Default marker
  }

  updateMap(location: string | undefined, pincode: string | undefined): void {
    const query = location || pincode;
    if (!query) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .then(response => response.json())
      .then(data => {
        if (data && data[0]) {
          const { lat, lon } = data[0];
          const latLng = new L.LatLng(lat, lon);
          this.map.setView(latLng, 13); // Zoom in to level 13
          this.marker.setLatLng(latLng); // Move marker to new location
          if(location){
            this.onboardData.location = location;
          } else if(pincode){
            this.onboardData.location = pincode;
          }
        }
      })
      .catch(error => console.error("Error fetching location:", error));
  }

  nextStep(): void {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.isOptionSelected = false;
      if (this.currentStep.isLocationStep) {
        this.isMapLoading = true; // Show loader
        setTimeout(() => this.initializeMap(), 1000);
      }
    }
  }

  previousStep(): void {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.isOptionSelected = false;
      if (this.currentStep.isLocationStep) {
        setTimeout(() => this.initializeMap(), 0);
      }
    }
  }

  selectOption(option: string): void {
    if (this.currentStepIndex === 0) {
      this.onboardData.specialization = option;
    } else if (this.currentStepIndex === 1) {
      this.onboardData.experience = option;
    } else if (this.currentStepIndex === 2) {
      this.onboardData.association = option;
    }
    this.selectedOption = option;
    this.isOptionSelected = true;
    console.log('Current onboard data:', this.onboardData);
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
  }

  submitForm(){
    this.isLoading = true;
    const combinedData = {
      ...this.userData,
      ...this.onboardData
  };

  console.log(combinedData); // Log the combined data
  const { password, confirmPassword, ...loggedData } = combinedData;
  console.log(loggedData); 

  // Now send combinedData to the API
  this.userService.createUser(combinedData).subscribe({
    next: (response) => {
      console.log('User registered successfully:', response);
      this.isLoading = false;
      this.showSuccessPopup = true;
    },
    error: (error) => {
      console.error('Error registering user:', error);
    }
  });
  }
}
