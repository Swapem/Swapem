//
//  SwapemUITests.swift
//  SwapemUITests
//
//  Created by Lisa Wong on 2015-11-28.
//  Copyright © 2015 Facebook. All rights reserved.
//

import XCTest

class SwapemUITests: XCTestCase {
        
  override func setUp() {
      super.setUp()
      
      // Put setup code here. This method is called before the invocation of each test method in the class.
      
      // In UI tests it is usually best to stop immediately when a failure occurs.
      continueAfterFailure = true
      // UI tests must launch the application that they test. Doing this in setup will make sure it happens for each test method.
      XCUIApplication().launch()

      // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
  }

  override func tearDown() {
    // Put teardown code here. This method is called after the invocation of each test method in the class.
    super.tearDown()
  }

  func testExample() {
    // Use recording to get started writing UI tests.
    // Use XCTAssert and related functions to verify your tests produce the correct results.
    
    
    
  }
  
  func testAddProfile(){
    let app = XCUIApplication()
    app.navigationBars["My Profiles"].buttons["Add"].tap()
    app.alerts["Enter profile name"].collectionViews.buttons["Save"].pressForDuration(0.5);
    XCTAssert(app.otherElements["    school  "].exists, "school does not exist")
    app.navigationBars["My Profiles"].buttons["Delete All"].tap()
    XCTAssert(!app.otherElements["    school  "].exists, "school still exist after delete all")
  }
  
  func testAddProfileDetails(){
    
    let app = XCUIApplication()
    app.navigationBars["My Profiles"].buttons["Add"].tap()
    app.alerts["Enter profile name"].collectionViews.buttons["Save"].tap()
    app.otherElements["     school  "].otherElements["    school  "].tap()
    UIPasteboard.generalPasteboard().string = "Lisa Wong"
    
    app.otherElements["         Name      Phone      Email      facebook.com/       linkedin.com/in/       Notes  "].otherElements["    Name "].doubleTap()
    app.menuItems["Paste"].tap()
    
    UIPasteboard.generalPasteboard().string = "778-399-9898"
    app.otherElements["              Phone      Email      facebook.com/       linkedin.com/in/       Notes  "].otherElements["    Phone "].tap()
    app.otherElements["         Lisa Wong      Phone      Email      facebook.com/       linkedin.com/in/       Notes  "].otherElements["    Phone "].tap()
    app.menuItems["Paste"].tap()
    
    UIPasteboard.generalPasteboard().string = "lisaw@example.com"

    app.otherElements["         Lisa Wong           Email      facebook.com/       linkedin.com/in/       Notes  "].otherElements["    Email "].tap()
    app.otherElements["         Lisa Wong      778-399-9898      Email      facebook.com/       linkedin.com/in/       Notes  "].otherElements["    Email "].tap()
    app.menuItems["Paste"].tap()

    UIPasteboard.generalPasteboard().string = "Software Developer"
    app.otherElements["         Lisa Wong      778-399-9898           facebook.com/       linkedin.com/in/       Notes  "].otherElements["    Notes "].tap()
    app.otherElements["         Lisa Wong      778-399-9898      lisaw@example.com      facebook.com/       linkedin.com/in/       Notes  "].otherElements["    Notes "].tap()
    app.menuItems["Paste"].tap()
    
    let schoolNavigationBar = app.navigationBars["school"]
    schoolNavigationBar.buttons["Save"].tap()
    
    let okButton = app.alerts["Alert"].collectionViews.buttons["OK"]
    okButton.tap()
    schoolNavigationBar.childrenMatchingType(.Button).matchingIdentifier("Back").elementBoundByIndex(0).tap()
    app.otherElements["     school  "].otherElements["    school  "].tap()
    sleep(1)
    XCTAssert(app.otherElements["         Lisa Wong      778-399-9898      lisaw@example.com      facebook.com/       linkedin.com/in/       Software Developer  "].exists, "profile information did not save")
    app.navigationBars["school"].childrenMatchingType(.Button).matchingIdentifier("Back").elementBoundByIndex(0).tap()
    app.navigationBars["My Profiles"].buttons["Delete All"].tap()
    XCTAssert(!app.otherElements["    school  "].exists, "school still exist after delete all")
  }
  
  func testRequests(){
    
  }
  
  func testAcceptRequests(){
    
  }
  
  func testContacts(){
    
  }
}
