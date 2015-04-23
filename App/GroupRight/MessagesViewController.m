//
//  MessagesViewController.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/22/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "MessagesViewController.h"
#import "GRMainModule.h"

@interface MessagesViewController ()

@end

@implementation MessagesViewController
NSString* activeGroupId;
BOOL isSelectingGroups=YES;
NSString* activeGroupName;
- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

- (IBAction)toggleGroupPicker:(id)sender {
    NSLog(@"Hello");
    if(isSelectingGroups){
        self.currentGroupNameLabel.text=activeGroupName;
        self.groupPIcker.hidden=YES;
        //self.confirmButton.=@"Change Group";
        [self.confirmButton setTitle:@"Change" forState:UIControlStateNormal];
    }
    else{
        //self.activeGroup.topItem.title=@"Select Group";
        self.groupPIcker.hidden=NO;
        //self.changeButton.title=@"Done";
        [self.confirmButton setTitle:@"Done" forState:UIControlStateNormal];
    }
    isSelectingGroups=!isSelectingGroups;
    //if (self.groupPIcker) self.groupPIcker.hidden = !self.groupPIcker.hidden;
}

-(NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView{
    return 1;
}
-(NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component{
    GRMainModule *grmm=[GRMainModule grMain];
    return [grmm.groups count];
}
-(NSString *)pickerView:(UIPickerView *)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component{
    GRMainModule *grmm=[GRMainModule grMain];
    //return @"hello";
    return [[grmm.groups objectAtIndex:row] objectForKey:@"group_name"];
}
-(void)pickerView:(UIPickerView *)pickerView didSelectRow:(NSInteger)row inComponent:(NSInteger)component{
    GRMainModule *grmm=[GRMainModule grMain];
    //return @"hello";
    activeGroupId=[[grmm.groups objectAtIndex:row] objectForKey:@"group_id"];
    activeGroupName=[[grmm.groups objectAtIndex:row] objectForKey:@"group_name"];
}


@end
