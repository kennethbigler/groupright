//
//  TasksViewController.m
//  GroupRight
//
//  Created by Zachary Wilson on 4/22/15.
//  Copyright (c) 2015 Zachary Wilson. All rights reserved.
//

#import "TasksViewController.h"
#import "GRMainModule.h"
#import "LoginViewController.h"
#import "TasksTableViewCell.h"
#import "TaskDetailViewController.h"

@interface TasksViewController ()

@end

@implementation TasksViewController

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/
- (void)viewDidLoad {
    [super viewDidLoad];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(doYourStuff)
                                                 name:UIApplicationWillEnterForegroundNotification object:nil];
    // Do any additional setup after loading the view, typically from a nib.
}
-(void)doYourStuff{
    [_TasksTable reloadData];
}

-(void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}


-(UITableView*) TasksTable{
    return _TasksTable;
}

- (void)viewDidAppear:(BOOL)animated
{
    GRMainModule *grmm = [GRMainModule grMain];
    
    
    if([grmm ac] == nil )
    {
        UIStoryboard *storyboard = self.storyboard;
        
        LoginViewController *lvc = [storyboard instantiateViewControllerWithIdentifier:@"loginVC"];
        [self presentViewController:lvc animated:NO completion:nil];
    }
    //LoginViewController *lvc = [storyboard instantiateViewControllerWithIdentifier:@"loginVC"];
    //[self presentViewController:lvc animated:NO completion:nil];
    [_TasksTable reloadData];
    //NSLog(@"Hello1");
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


// =============================================================================================
//  Tasks Table
// =============================================================================================

- (NSInteger) numberOfSectionsInTableView:(UITableView *)tableView{
    return 1;
}

- (NSInteger) tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    GRMainModule *grmm = [GRMainModule grMain];
    //NSLog(@"Hello");
    return [grmm.tasks count];
}

- (UITableViewCell *) tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    GRMainModule *grmm = [GRMainModule grMain];
    static NSString *cellID = @"TasksCell";
    NSDictionary *task = [grmm.tasks objectAtIndex: indexPath.row];
    UIColor *grColor = [grmm getColorForGroupWithId:[task objectForKey:@"group_id"] AtAlpha:1.0f];
    
    //Get a new or recycled cell
    TasksTableViewCell *cell = (TasksTableViewCell *)[tableView dequeueReusableCellWithIdentifier:cellID];
    if (cell == nil)
    {
        NSArray *nib = [[NSBundle mainBundle] loadNibNamed:@"TasksTableCell" owner:self options:nil];
        cell = (TasksTableViewCell*)[nib objectAtIndex:0];
        CAShapeLayer *circleLayer = [CAShapeLayer layer];
        circleLayer.path = [UIBezierPath bezierPathWithOvalInRect:CGRectMake(0, 0, 30, 30)].CGPath;
        if([[task objectForKey:@"is_completed"] isEqual:@"1"]){
            circleLayer.fillColor = grColor.CGColor;
            circleLayer.strokeColor = [UIColor colorWithRed:.44 green:.44 blue:.44 alpha:1].CGColor;
            circleLayer.lineWidth = 2;
        }
        else{
            circleLayer.fillColor = [UIColor whiteColor].CGColor;
            circleLayer.strokeColor = grColor.CGColor;
            circleLayer.lineWidth = 2;
        }
        [cell.completedButton.layer addSublayer:circleLayer];
    }
    else{
        //We just need to make some changes
        CAShapeLayer *circleLayer;
        circleLayer=[cell.completedButton.layer.sublayers objectAtIndex:0];
        if([[task objectForKey:@"is_completed"] isEqual:@"1"]){
            circleLayer.fillColor = grColor.CGColor;
            circleLayer.strokeColor = [UIColor colorWithRed:.44 green:.44 blue:.44 alpha:1].CGColor;
            circleLayer.lineWidth = 2;
        }
        else{
            circleLayer.fillColor = [UIColor whiteColor].CGColor;
            circleLayer.strokeColor = grColor.CGColor;
            circleLayer.lineWidth = 2;
        }
    }
    
    //Set Name and Description
    cell.description.text = [task objectForKey:@"task_title"];
    cell.colorImage.backgroundColor = grColor;
    cell.colorImage.image = nil;
    //cell.statusImage.backgroundColor = grColor;
    
    if(![[task objectForKey:@"link_type"] isEqual:[NSNull null]]){
        [cell.completedButton setAccessibilityValue:@"null"];
    }
    else if([[task objectForKey:@"is_completed"] isEqual:@"1"]){
        [cell.completedButton setAccessibilityValue:@"completed"];
    }
    else{
        [cell.completedButton setAccessibilityValue:[task objectForKey:@"task_uid"]];
    }
    
    UIView *bgColorView = [[UIView alloc] init];
    bgColorView.backgroundColor = grColor;
    [cell setSelectedBackgroundView:bgColorView];
    
    
    return cell;
}

- (void) tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    GRMainModule *grmm = [GRMainModule grMain];
    NSDictionary *task = [grmm.tasks objectAtIndex: indexPath.row];

    UIStoryboard *storyboard=self.storyboard;
    TaskDetailViewController *tdvc=[storyboard instantiateViewControllerWithIdentifier:@"TaskDetail"];
    tdvc.color=[grmm getColorForGroupWithId:[task objectForKey:@"group_id"]AtAlpha:1];
    
    if([[task objectForKey:@"is_individual"] isEqual:@"1"]){
        tdvc.responsibility_string=@"You";
    }
    else{
        tdvc.responsibility_string=@"Group";
    }
    
    tdvc.task_title_string=[task objectForKey:@"task_title"];
    tdvc.creator_string=[grmm getFullNameForEmail:[task objectForKey:@"creator"]];
    tdvc.group_string=[grmm getFullNameForGroupWithId:[task objectForKey:@"group_id"]];
    if([[task objectForKey:@"task_description"] isEqualToString:@""]){
        tdvc.description_string=@"None Provided";
    }
    else{
        tdvc.description_string=[task objectForKey:@"task_description"];
    }
    [self presentViewController:tdvc animated:YES completion:nil];
                                    
    
    
}



@end
